import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

// This function handles both creating a new cabin and editing an existing one, depending on whether an id is provided or not. This is the most important function in the file, as it handles the complex logic of uploading the cabin image to Supabase Storage and ensuring data consistency between the "cabins" table and the storage bucket.
export async function createOrEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imagename = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    "",
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imagename}`;

  // 1. Create the cabin record without the image
  let query = supabase.from("cabins");

  // If an id is not provided, we are creating a new cabin.
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // If an id is provided, we are editing an existing cabin.
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  // 2. Upload the image to Supabase Storage
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imagename, newCabin.image);

  //3. Handle potential cabin image upload error

  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error("Cabin image could not be uploaded");
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}
