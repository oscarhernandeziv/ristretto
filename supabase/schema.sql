SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."distribution_channel" AS ENUM (
    'DSD',
    'WHSL',
    'RETAIL',
    'ECOMM'
);


ALTER TYPE "public"."distribution_channel" OWNER TO "postgres";


CREATE TYPE "public"."downtime_category" AS ENUM (
    'planned',
    'unplanned',
    'maintenance',
    'setup',
    'quality'
);


ALTER TYPE "public"."downtime_category" OWNER TO "postgres";


CREATE TYPE "public"."green_item_container" AS ENUM (
    'JUTE',
    'SSX'
);


ALTER TYPE "public"."green_item_container" OWNER TO "postgres";


CREATE TYPE "public"."impact_level" AS ENUM (
    'none',
    'partial',
    'complete'
);


ALTER TYPE "public"."impact_level" OWNER TO "postgres";


CREATE TYPE "public"."operator_certification" AS ENUM (
    'trainee',
    'certified',
    'expert'
);


ALTER TYPE "public"."operator_certification" OWNER TO "postgres";


CREATE TYPE "public"."pack_item_container" AS ENUM (
    'BAG',
    'CASE',
    'TRIO'
);


ALTER TYPE "public"."pack_item_container" OWNER TO "postgres";


CREATE TYPE "public"."pack_item_type" AS ENUM (
    'BLEND',
    'SO',
    'REG',
    'CB'
);


ALTER TYPE "public"."pack_item_type" OWNER TO "postgres";


CREATE TYPE "public"."planning_method" AS ENUM (
    'MTS',
    'MTO',
    'HYBRID'
);


ALTER TYPE "public"."planning_method" OWNER TO "postgres";


CREATE TYPE "public"."production_line_status" AS ENUM (
    'active',
    'inactive',
    'maintenance',
    'setup'
);


ALTER TYPE "public"."production_line_status" OWNER TO "postgres";


CREATE TYPE "public"."production_line_type" AS ENUM (
    'roasting',
    'packaging',
    'grinding'
);


ALTER TYPE "public"."production_line_type" OWNER TO "postgres";


CREATE TYPE "public"."production_record_status" AS ENUM (
    'in_progress',
    'completed',
    'interrupted'
);


ALTER TYPE "public"."production_record_status" OWNER TO "postgres";


CREATE TYPE "public"."roast_item_type" AS ENUM (
    'BLEND',
    'SO',
    'REG',
    'CB',
    'BODY'
);


ALTER TYPE "public"."roast_item_type" OWNER TO "postgres";


CREATE TYPE "public"."seasonality_type" AS ENUM (
    'YEAR_ROUND',
    'SEASONAL',
    'HOLIDAY',
    'LIMITED'
);


ALTER TYPE "public"."seasonality_type" OWNER TO "postgres";


CREATE TYPE "public"."work_order_status" AS ENUM (
    'planned',
    'released',
    'started',
    'completed',
    'cancelled'
);


ALTER TYPE "public"."work_order_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_net_weight"("weight_per_unit" numeric, "units_per_case" integer) RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN COALESCE(weight_per_unit, 0) * COALESCE(units_per_case, 1);
END;
$$;


ALTER FUNCTION "public"."calculate_net_weight"("weight_per_unit" numeric, "units_per_case" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_net_weight"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.net_weight = calculate_net_weight(NEW.weight_per_unit, NEW.units_per_case);
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_net_weight"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_green_item_type"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM items
        WHERE items.id = NEW.item_id AND items.type = 'GREEN'
    ) THEN
        RAISE EXCEPTION 'Invalid green_item_type. The item must exist in the items table with type "GREEN".';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."validate_green_item_type"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_pack_item_type"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM items
        WHERE items.id = NEW.item_id AND items.type = 'PACK'
    ) THEN
        RAISE EXCEPTION 'Invalid pack_item_type. The item must exist in the items table with type "PACK".';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."validate_pack_item_type"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_roast_item_type"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF NEW.roast_item_type NOT IN ('BLEND', 'SO', 'REG', 'CB', 'BODY') THEN
        RAISE EXCEPTION 'Invalid roast_item_type. Must be BLEND, SO, REG, CB, or BODY';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."validate_roast_item_type"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."downtime_events" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "production_line_id" "uuid" NOT NULL,
    "work_order_id" "uuid",
    "category" "public"."downtime_category" NOT NULL,
    "impact_level" "public"."impact_level" NOT NULL,
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone,
    "reason" "text" NOT NULL,
    "action_taken" "text",
    "reported_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."downtime_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."green_items" (
    "item_id" "uuid" NOT NULL,
    "lot" "text",
    "net_weight" numeric NOT NULL,
    "weight_unit" "text" NOT NULL,
    "green_item_container" "public"."green_item_container" NOT NULL,
    CONSTRAINT "green_items_weight_unit_check" CHECK (("weight_unit" = 'LB'::"text"))
);


ALTER TABLE "public"."green_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."items" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "number" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "type" "text" NOT NULL,
    "is_active" boolean NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "items_type_check" CHECK (("type" = ANY (ARRAY['PACK'::"text", 'ROAST'::"text", 'GREEN'::"text", 'MATERIAL'::"text"])))
);


ALTER TABLE "public"."items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."line_operators" (
    "production_line_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "certification_level" "public"."operator_certification" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."line_operators" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pack_items" (
    "item_id" "uuid" NOT NULL,
    "net_weight" numeric NOT NULL,
    "weight_unit" "text" NOT NULL,
    "units_per_case" integer NOT NULL,
    "pack_item_container" "public"."pack_item_container" NOT NULL,
    "weight_per_unit" numeric NOT NULL,
    "is_organic" boolean DEFAULT false NOT NULL,
    "is_ground" boolean DEFAULT false NOT NULL,
    "is_export" boolean DEFAULT false NOT NULL,
    "planning_method" "public"."planning_method" DEFAULT 'MTS'::"public"."planning_method" NOT NULL,
    "primary_channel" "public"."distribution_channel" DEFAULT 'RETAIL'::"public"."distribution_channel",
    "seasonality" "public"."seasonality_type" DEFAULT 'YEAR_ROUND'::"public"."seasonality_type" NOT NULL,
    "shelf_life_days" integer DEFAULT 7 NOT NULL,
    "pack_item_type" "public"."pack_item_type" DEFAULT 'BLEND'::"public"."pack_item_type" NOT NULL,
    CONSTRAINT "pack_items_units_per_case_check" CHECK ((("units_per_case")::numeric >= (1)::numeric)),
    CONSTRAINT "pack_items_weight_unit_check" CHECK (("weight_unit" = ANY (ARRAY['LB'::"text", 'OZ'::"text"])))
);


ALTER TABLE "public"."pack_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."production_lines" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "type" "public"."production_line_type" NOT NULL,
    "status" "public"."production_line_status" NOT NULL,
    "target_output_per_hour" numeric NOT NULL,
    "output_unit" "text" NOT NULL,
    "current_item_id" "uuid",
    "current_operator_id" "uuid",
    "last_changeover_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."production_lines" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."production_metrics" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "production_line_id" "uuid" NOT NULL,
    "work_order_id" "uuid" NOT NULL,
    "timestamp" timestamp with time zone DEFAULT "now"() NOT NULL,
    "output_rate" numeric NOT NULL,
    "efficiency" numeric,
    "quality_rate" numeric,
    "overall_equipment_effectiveness" numeric,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."production_metrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."production_records" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "work_order_id" "uuid" NOT NULL,
    "operator_id" "uuid" NOT NULL,
    "status" "public"."production_record_status" DEFAULT 'in_progress'::"public"."production_record_status" NOT NULL,
    "quantity_produced" numeric DEFAULT 0 NOT NULL,
    "quantity_rejected" numeric DEFAULT 0 NOT NULL,
    "start_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "end_time" timestamp with time zone,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."production_records" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."production_work_orders" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "production_line_id" "uuid" NOT NULL,
    "item_id" "uuid" NOT NULL,
    "status" "public"."work_order_status" DEFAULT 'planned'::"public"."work_order_status" NOT NULL,
    "planned_quantity" numeric NOT NULL,
    "actual_quantity" numeric,
    "planned_start_time" timestamp with time zone NOT NULL,
    "planned_end_time" timestamp with time zone,
    "actual_start_time" timestamp with time zone,
    "actual_end_time" timestamp with time zone,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."production_work_orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "username" "text",
    "full_name" "text",
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."roast_items" (
    "item_id" "uuid" NOT NULL,
    "is_organic" boolean DEFAULT false NOT NULL,
    "is_ground" boolean DEFAULT false NOT NULL,
    "roast_item_type" "public"."roast_item_type" NOT NULL
);


ALTER TABLE "public"."roast_items" OWNER TO "postgres";


ALTER TABLE ONLY "public"."downtime_events"
    ADD CONSTRAINT "downtime_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."green_items"
    ADD CONSTRAINT "green_items_pkey" PRIMARY KEY ("item_id");



ALTER TABLE ONLY "public"."items"
    ADD CONSTRAINT "items_number_key" UNIQUE ("number");



ALTER TABLE ONLY "public"."items"
    ADD CONSTRAINT "items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."line_operators"
    ADD CONSTRAINT "line_operators_pkey" PRIMARY KEY ("production_line_id", "user_id");



ALTER TABLE ONLY "public"."pack_items"
    ADD CONSTRAINT "pack_items_pkey" PRIMARY KEY ("item_id");



ALTER TABLE ONLY "public"."production_lines"
    ADD CONSTRAINT "production_lines_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."production_lines"
    ADD CONSTRAINT "production_lines_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."production_metrics"
    ADD CONSTRAINT "production_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."production_records"
    ADD CONSTRAINT "production_records_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."production_work_orders"
    ADD CONSTRAINT "production_work_orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."roast_items"
    ADD CONSTRAINT "roast_items_pkey" PRIMARY KEY ("item_id");



CREATE INDEX "idx_downtime_events_production_line" ON "public"."downtime_events" USING "btree" ("production_line_id");



CREATE INDEX "idx_production_metrics_production_line" ON "public"."production_metrics" USING "btree" ("production_line_id");



CREATE INDEX "idx_production_records_work_order" ON "public"."production_records" USING "btree" ("work_order_id");



CREATE INDEX "idx_production_work_orders_item" ON "public"."production_work_orders" USING "btree" ("item_id");



CREATE INDEX "idx_production_work_orders_production_line" ON "public"."production_work_orders" USING "btree" ("production_line_id");



CREATE OR REPLACE TRIGGER "green_item_type_validation" BEFORE INSERT OR UPDATE ON "public"."green_items" FOR EACH ROW EXECUTE FUNCTION "public"."validate_green_item_type"();



CREATE OR REPLACE TRIGGER "net_weight_trigger" BEFORE INSERT OR UPDATE ON "public"."pack_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_net_weight"();



CREATE OR REPLACE TRIGGER "pack_item_type_validation" BEFORE INSERT OR UPDATE ON "public"."pack_items" FOR EACH ROW EXECUTE FUNCTION "public"."validate_pack_item_type"();



CREATE OR REPLACE TRIGGER "roast_item_type_validation" BEFORE INSERT OR UPDATE ON "public"."roast_items" FOR EACH ROW EXECUTE FUNCTION "public"."validate_roast_item_type"();



ALTER TABLE ONLY "public"."downtime_events"
    ADD CONSTRAINT "downtime_events_production_line_id_fkey" FOREIGN KEY ("production_line_id") REFERENCES "public"."production_lines"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."downtime_events"
    ADD CONSTRAINT "downtime_events_reported_by_fkey" FOREIGN KEY ("reported_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."downtime_events"
    ADD CONSTRAINT "downtime_events_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "public"."production_work_orders"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."green_items"
    ADD CONSTRAINT "green_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."line_operators"
    ADD CONSTRAINT "line_operators_production_line_id_fkey" FOREIGN KEY ("production_line_id") REFERENCES "public"."production_lines"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."line_operators"
    ADD CONSTRAINT "line_operators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pack_items"
    ADD CONSTRAINT "pack_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."production_lines"
    ADD CONSTRAINT "production_lines_current_item_id_fkey" FOREIGN KEY ("current_item_id") REFERENCES "public"."items"("id");



ALTER TABLE ONLY "public"."production_lines"
    ADD CONSTRAINT "production_lines_current_operator_id_fkey" FOREIGN KEY ("current_operator_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."production_metrics"
    ADD CONSTRAINT "production_metrics_production_line_id_fkey" FOREIGN KEY ("production_line_id") REFERENCES "public"."production_lines"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."production_metrics"
    ADD CONSTRAINT "production_metrics_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "public"."production_work_orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."production_records"
    ADD CONSTRAINT "production_records_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."production_records"
    ADD CONSTRAINT "production_records_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "public"."production_work_orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."production_work_orders"
    ADD CONSTRAINT "production_work_orders_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id");



ALTER TABLE ONLY "public"."production_work_orders"
    ADD CONSTRAINT "production_work_orders_production_line_id_fkey" FOREIGN KEY ("production_line_id") REFERENCES "public"."production_lines"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."roast_items"
    ADD CONSTRAINT "roast_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE CASCADE;



CREATE POLICY "Enable read access for all users" ON "public"."green_items" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."items" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."pack_items" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."roast_items" FOR SELECT USING (true);



CREATE POLICY "Enable read access for authenticated users" ON "public"."downtime_events" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for authenticated users" ON "public"."line_operators" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for authenticated users" ON "public"."production_lines" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for authenticated users" ON "public"."production_metrics" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for authenticated users" ON "public"."production_records" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for authenticated users" ON "public"."production_work_orders" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



ALTER TABLE "public"."downtime_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."green_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."line_operators" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pack_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."production_lines" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."production_metrics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."production_records" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."production_work_orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roast_items" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."calculate_net_weight"("weight_per_unit" numeric, "units_per_case" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_net_weight"("weight_per_unit" numeric, "units_per_case" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_net_weight"("weight_per_unit" numeric, "units_per_case" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_net_weight"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_net_weight"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_net_weight"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_green_item_type"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_green_item_type"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_green_item_type"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_pack_item_type"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_pack_item_type"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_pack_item_type"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_roast_item_type"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_roast_item_type"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_roast_item_type"() TO "service_role";


















GRANT ALL ON TABLE "public"."downtime_events" TO "anon";
GRANT ALL ON TABLE "public"."downtime_events" TO "authenticated";
GRANT ALL ON TABLE "public"."downtime_events" TO "service_role";



GRANT ALL ON TABLE "public"."green_items" TO "anon";
GRANT ALL ON TABLE "public"."green_items" TO "authenticated";
GRANT ALL ON TABLE "public"."green_items" TO "service_role";



GRANT ALL ON TABLE "public"."items" TO "anon";
GRANT ALL ON TABLE "public"."items" TO "authenticated";
GRANT ALL ON TABLE "public"."items" TO "service_role";



GRANT ALL ON TABLE "public"."line_operators" TO "anon";
GRANT ALL ON TABLE "public"."line_operators" TO "authenticated";
GRANT ALL ON TABLE "public"."line_operators" TO "service_role";



GRANT ALL ON TABLE "public"."pack_items" TO "anon";
GRANT ALL ON TABLE "public"."pack_items" TO "authenticated";
GRANT ALL ON TABLE "public"."pack_items" TO "service_role";



GRANT ALL ON TABLE "public"."production_lines" TO "anon";
GRANT ALL ON TABLE "public"."production_lines" TO "authenticated";
GRANT ALL ON TABLE "public"."production_lines" TO "service_role";



GRANT ALL ON TABLE "public"."production_metrics" TO "anon";
GRANT ALL ON TABLE "public"."production_metrics" TO "authenticated";
GRANT ALL ON TABLE "public"."production_metrics" TO "service_role";



GRANT ALL ON TABLE "public"."production_records" TO "anon";
GRANT ALL ON TABLE "public"."production_records" TO "authenticated";
GRANT ALL ON TABLE "public"."production_records" TO "service_role";



GRANT ALL ON TABLE "public"."production_work_orders" TO "anon";
GRANT ALL ON TABLE "public"."production_work_orders" TO "authenticated";
GRANT ALL ON TABLE "public"."production_work_orders" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."roast_items" TO "anon";
GRANT ALL ON TABLE "public"."roast_items" TO "authenticated";
GRANT ALL ON TABLE "public"."roast_items" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;

-- Create function to calculate planned end time based on production rate
CREATE OR REPLACE FUNCTION "public"."calculate_planned_end_time"()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    target_output_per_hour numeric;
    estimated_runtime_hours numeric;
BEGIN
    -- Get the production line's target output rate
    SELECT pl.target_output_per_hour 
    INTO target_output_per_hour
    FROM production_lines pl 
    WHERE pl.id = NEW.production_line_id;

    -- Calculate estimated runtime in hours based on planned quantity and target output rate
    -- Add 20% buffer for setup, changeovers, and minor interruptions
    estimated_runtime_hours := (NEW.planned_quantity / target_output_per_hour) * 1.2;
    
    -- Set planned_end_time based on planned_start_time and calculated runtime
    NEW.planned_end_time := NEW.planned_start_time + (estimated_runtime_hours * interval '1 hour');
    
    RETURN NEW;
END;
$$;

-- Drop existing planned_end_time NOT NULL constraint
ALTER TABLE "public"."production_work_orders"
    ALTER COLUMN "planned_end_time" DROP NOT NULL;

-- Create trigger to auto-calculate planned_end_time
CREATE OR REPLACE TRIGGER "calculate_planned_end_time_trigger"
    BEFORE INSERT OR UPDATE OF planned_start_time, item_id, planned_quantity, production_line_id
    ON "public"."production_work_orders"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."calculate_planned_end_time"();

-- Grant permissions for the new function
GRANT ALL ON FUNCTION "public"."calculate_planned_end_time"() TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_planned_end_time"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_planned_end_time"() TO "service_role";

-- Add work_order_number column as a simple text field
ALTER TABLE "public"."production_work_orders"
ADD COLUMN "work_order_number" text NOT NULL,
ADD CONSTRAINT "production_work_orders_work_order_number_key" UNIQUE ("work_order_number");

RESET ALL;

-- Items table policies
CREATE POLICY "Enable read access for authenticated users" ON "public"."items" 
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON "public"."items" 
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON "public"."items" 
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Pack items table policies
CREATE POLICY "Enable read access for authenticated users" ON "public"."pack_items" 
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON "public"."pack_items" 
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON "public"."pack_items" 
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Roast items table policies
CREATE POLICY "Enable read access for authenticated users" ON "public"."roast_items" 
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON "public"."roast_items" 
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON "public"."roast_items" 
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Green items table policies
CREATE POLICY "Enable read access for authenticated users" ON "public"."green_items" 
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON "public"."green_items" 
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON "public"."green_items" 
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Production work orders table policies
CREATE POLICY "Enable read access for authenticated users" ON "public"."production_work_orders" 
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON "public"."production_work_orders" 
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON "public"."production_work_orders" 
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Drop existing conflicting policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."items";
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."pack_items";
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."roast_items";
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."green_items";

RESET ALL;
