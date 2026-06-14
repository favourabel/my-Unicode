import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://efhaleciomzdxefjgxdj.supabase.co";

const supabaseAnonKey = "sb_publishable_Dv2ByVPmL_nCFz0qPs3qlg_WFtXpNT2";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);