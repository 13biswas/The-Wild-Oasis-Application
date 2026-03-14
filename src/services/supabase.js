import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabaseUrl = "https://mthetqgknlzrrwpgydtn.supabase.co";
const supabaseKey = "sb_publishable_MR447BzX0gi_CgOpKYFgxQ_KTc7seS-";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
