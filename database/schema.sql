-- --
-- -- PostgreSQL database dump
-- --

-- \restrict 5kgLJ3uPmOeHY1tWkneUcdygVDGPzTfmsE5KtnGrsHl5t8czAi7VOm4StqcIhVK

-- -- Dumped from database version 17.10
-- -- Dumped by pg_dump version 17.10

-- -- Started on 2026-07-12 11:11:08

-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET transaction_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;

-- --
-- -- TOC entry 881 (class 1247 OID 16697)
-- -- Name: driverstatus; Type: TYPE; Schema: public; Owner: postgres
-- --

-- CREATE TYPE public.driverstatus AS ENUM (
--     'AVAILABLE',
--     'ON_TRIP',
--     'OFF_DUTY',
--     'SUSPENDED'
-- );


-- ALTER TYPE public.driverstatus OWNER TO postgres;

-- --
-- -- TOC entry 905 (class 1247 OID 16827)
-- -- Name: expensetype; Type: TYPE; Schema: public; Owner: postgres
-- --

-- CREATE TYPE public.expensetype AS ENUM (
--     'FUEL',
--     'MAINTENANCE',
--     'TOLL',
--     'PARKING',
--     'MISCELLANEOUS'
-- );


-- ALTER TYPE public.expensetype OWNER TO postgres;

-- --
-- -- TOC entry 893 (class 1247 OID 16761)
-- -- Name: maintenancestatus; Type: TYPE; Schema: public; Owner: postgres
-- --

-- CREATE TYPE public.maintenancestatus AS ENUM (
--     'PENDING',
--     'IN_PROGRESS',
--     'COMPLETED'
-- );


-- ALTER TYPE public.maintenancestatus OWNER TO postgres;

-- --
-- -- TOC entry 899 (class 1247 OID 16790)
-- -- Name: tripstatus; Type: TYPE; Schema: public; Owner: postgres
-- --

-- CREATE TYPE public.tripstatus AS ENUM (
--     'DRAFT',
--     'DISPATCHED',
--     'COMPLETED',
--     'CANCELLED'
-- );


-- ALTER TYPE public.tripstatus OWNER TO postgres;

-- --
-- -- TOC entry 887 (class 1247 OID 16725)
-- -- Name: vehiclestatus; Type: TYPE; Schema: public; Owner: postgres
-- --

-- CREATE TYPE public.vehiclestatus AS ENUM (
--     'AVAILABLE',
--     'ON_TRIP',
--     'IN_SHOP',
--     'RETIRED'
-- );


-- ALTER TYPE public.vehiclestatus OWNER TO postgres;

-- SET default_tablespace = '';

-- SET default_table_access_method = heap;

-- --
-- -- TOC entry 217 (class 1259 OID 16634)
-- -- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
-- --

-- CREATE TABLE public.alembic_version (
--     version_num character varying(32) NOT NULL
-- );


-- ALTER TABLE public.alembic_version OWNER TO postgres;

-- --
-- -- TOC entry 227 (class 1259 OID 16706)
-- -- Name: drivers; Type: TABLE; Schema: public; Owner: postgres
-- --

-- CREATE TABLE public.drivers (
--     id integer NOT NULL,
--     user_id integer NOT NULL,
--     license_number character varying(50) NOT NULL,
--     license_category character varying(20) NOT NULL,
--     license_expiry date NOT NULL,
--     safety_score numeric(5,2),
--     status public.driverstatus NOT NULL,
--     created_at timestamp with time zone DEFAULT now(),
--     updated_at timestamp with time zone DEFAULT now()
-- );


-- ALTER TABLE public.drivers OWNER TO postgres;

-- --
-- -- TOC entry 226 (class 1259 OID 16705)
-- -- Name: drivers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
-- --

-- CREATE SEQUENCE public.drivers_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE public.drivers_id_seq OWNER TO postgres;

-- --
-- -- TOC entry 5065 (class 0 OID 0)
-- -- Dependencies: 226
-- -- Name: drivers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
-- --

-- ALTER SEQUENCE public.drivers_id_seq OWNED BY public.drivers.id;


-- --
-- -- TOC entry 235 (class 1259 OID 16838)
-- -- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
-- --

-- CREATE TABLE public.expenses (
--     id integer NOT NULL,
--     trip_id integer NOT NULL,
--     vehicle_id integer NOT NULL,
--     type public.expensetype NOT NULL,
--     amount numeric(12,2) NOT NULL,
--     description text,
--     expense_date date NOT NULL,
--     created_at timestamp with time zone DEFAULT now()
-- );


-- ALTER TABLE public.expenses OWNER TO postgres;

-- --
-- -- TOC entry 234 (class 1259 OID 16837)
-- -- Name: expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
-- --

-- CREATE SEQUENCE public.expenses_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE public.expenses_id_seq OWNER TO postgres;

-- --
-- -- TOC entry 5066 (class 0 OID 0)
-- -- Dependencies: 234
-- -- Name: expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
-- --

-- ALTER SEQUENCE public.expenses_id_seq OWNED BY public.expenses.id;


-- --
-- -- TOC entry 237 (class 1259 OID 16859)
-- -- Name: fuel_logs; Type: TABLE; Schema: public; Owner: postgres
-- --

-- CREATE TABLE public.fuel_logs (
--     id integer NOT NULL,
--     vehicle_id integer NOT NULL,
--     trip_id integer NOT NULL,
--     liters numeric(10,2) NOT NULL,
--     cost numeric(10,2) NOT NULL,
--     fuel_station character varying(100),
--     date date NOT NULL,
--     created_at timestamp with time zone DEFAULT now()
-- );


-- ALTER TABLE public.fuel_logs OWNER TO postgres;

-- --
-- -- TOC entry 236 (class 1259 OID 16858)
-- -- Name: fuel_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
-- --

-- CREATE SEQUENCE public.fuel_logs_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE public.fuel_logs_id_seq OWNER TO postgres;

-- --
-- -- TOC entry 5067 (class 0 OID 0)
-- -- Dependencies: 236
-- -- Name: fuel_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
-- --

-- ALTER SEQUENCE public.fuel_logs_id_seq OWNED BY public.fuel_logs.id;


-- --
-- -- TOC entry 231 (class 1259 OID 16768)
-- -- Name: maintenance_logs; Type: TABLE; Schema: public; Owner: postgres
-- --

-- CREATE TABLE public.maintenance_logs (
--     id integer NOT NULL,
--     vehicle_id integer NOT NULL,
--     issue character varying(200) NOT NULL,
--     description text,
--     maintenance_cost numeric(12,2),
--     start_date date,
--     end_date date,
--     status public.maintenancestatus NOT NULL,
--     created_by integer,
--     created_at timestamp with time zone DEFAULT now(),
--     updated_at timestamp with time zone DEFAULT now()
-- );


-- ALTER TABLE public.maintenance_logs OWNER TO postgres;

-- --
-- -- TOC entry 230 (class 1259 OID 16767)
-- -- Name: maintenance_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
-- --

-- CREATE SEQUENCE public.maintenance_logs_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE public.maintenance_logs_id_seq OWNER TO postgres;

-- --
-- -- TOC entry 5068 (class 0 OID 0)
-- -- Dependencies: 230
-- -- Name: maintenance_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
-- --

-- ALTER SEQUENCE public.maintenance_logs_id_seq OWNED BY public.maintenance_logs.id;


-- --
-- -- TOC entry 219 (class 1259 OID 16640)
-- -- Name: regions; Type: TABLE; Schema: public; Owner: postgres
-- --

-- CREATE TABLE public.regions (
--     id integer NOT NULL,
--     name character varying(50) NOT NULL,
--     code character varying(10) NOT NULL
-- );


-- ALTER TABLE public.regions OWNER TO postgres;

-- --
-- -- TOC entry 218 (class 1259 OID 16639)
-- -- Name: regions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
-- --

-- CREATE SEQUENCE public.regions_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE public.regions_id_seq OWNER TO postgres;

-- --
-- -- TOC entry 5069 (class 0 OID 0)
-- -- Dependencies: 218
-- -- Name: regions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
-- --

-- ALTER SEQUENCE public.regions_id_seq OWNED BY public.regions.id;


-- --
-- -- TOC entry 221 (class 1259 OID 16652)
-- -- Name: roles; Type: TABLE; Schema: public; Owner: postgres
-- --

-- CREATE TABLE public.roles (
--     id integer NOT NULL,
--     name character varying(50) NOT NULL,
--     description text,
--     created_at timestamp with time zone DEFAULT now(),
--     updated_at timestamp with time zone DEFAULT now()
-- );


-- ALTER TABLE public.roles OWNER TO postgres;

-- --
-- -- TOC entry 220 (class 1259 OID 16651)
-- -- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
-- --

-- CREATE SEQUENCE public.roles_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

-- --
-- -- TOC entry 5070 (class 0 OID 0)
-- -- Dependencies: 220
-- -- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
-- --

-- ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


-- --
-- -- TOC entry 233 (class 1259 OID 16800)
-- -- Name: trips; Type: TABLE; Schema: public; Owner: postgres
-- --

-- CREATE TABLE public.trips (
--     id integer NOT NULL,
--     trip_number character varying(30) NOT NULL,
--     vehicle_id integer NOT NULL,
--     driver_id integer NOT NULL,
--     source character varying(150) NOT NULL,
--     destination character varying(150) NOT NULL,
--     cargo_weight numeric(10,2) NOT NULL,
--     planned_distance numeric(10,2) NOT NULL,
--     actual_distance numeric(10,2),
--     fuel_used numeric(10,2),
--     revenue numeric(12,2),
--     status public.tripstatus NOT NULL,
--     departure_time timestamp without time zone,
--     arrival_time timestamp without time zone,
--     created_by integer,
--     created_at timestamp with time zone DEFAULT now(),
--     updated_at timestamp with time zone DEFAULT now()
-- );


-- ALTER TABLE public.trips OWNER TO postgres;

-- --
-- -- TOC entry 232 (class 1259 OID 16799)
-- -- Name: trips_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
-- --

-- CREATE SEQUENCE public.trips_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE public.trips_id_seq OWNER TO postgres;

-- --
-- -- TOC entry 5071 (class 0 OID 0)
-- -- Dependencies: 232
-- -- Name: trips_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
-- --

-- ALTER SEQUENCE public.trips_id_seq OWNED BY public.trips.id;


-- --
-- -- TOC entry 225 (class 1259 OID 16678)
-- -- Name: users; Type: TABLE; Schema: public; Owner: postgres
-- --

-- CREATE TABLE public.users (
--     id integer NOT NULL,
--     role_id integer NOT NULL,
--     full_name character varying(100) NOT NULL,
--     email character varying(100) NOT NULL,
--     password_hash character varying NOT NULL,
--     phone character varying(15),
--     is_active boolean,
--     created_at timestamp with time zone DEFAULT now(),
--     updated_at timestamp with time zone DEFAULT now()
-- );


-- ALTER TABLE public.users OWNER TO postgres;

-- --
-- -- TOC entry 224 (class 1259 OID 16677)
-- -- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
-- --

-- CREATE SEQUENCE public.users_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

-- --
-- -- TOC entry 5072 (class 0 OID 0)
-- -- Dependencies: 224
-- -- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
-- --

-- ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


-- --
-- -- TOC entry 223 (class 1259 OID 16666)
-- -- Name: vehicle_types; Type: TABLE; Schema: public; Owner: postgres
-- --

-- CREATE TABLE public.vehicle_types (
--     id integer NOT NULL,
--     name character varying(50) NOT NULL,
--     description text
-- );


-- ALTER TABLE public.vehicle_types OWNER TO postgres;

-- --
-- -- TOC entry 222 (class 1259 OID 16665)
-- -- Name: vehicle_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
-- --

-- CREATE SEQUENCE public.vehicle_types_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE public.vehicle_types_id_seq OWNER TO postgres;

-- --
-- -- TOC entry 5073 (class 0 OID 0)
-- -- Dependencies: 222
-- -- Name: vehicle_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
-- --

-- ALTER SEQUENCE public.vehicle_types_id_seq OWNED BY public.vehicle_types.id;


-- --
-- -- TOC entry 229 (class 1259 OID 16734)
-- -- Name: vehicles; Type: TABLE; Schema: public; Owner: postgres
-- --

-- CREATE TABLE public.vehicles (
--     id integer NOT NULL,
--     registration_number character varying(20) NOT NULL,
--     vehicle_name character varying(100) NOT NULL,
--     vehicle_type_id integer NOT NULL,
--     region_id integer NOT NULL,
--     max_load_capacity numeric(10,2) NOT NULL,
--     current_odometer numeric(12,2),
--     acquisition_cost numeric(12,2),
--     purchase_date date,
--     status public.vehiclestatus NOT NULL,
--     is_active boolean,
--     created_by integer,
--     created_at timestamp with time zone DEFAULT now(),
--     updated_at timestamp with time zone DEFAULT now()
-- );


-- ALTER TABLE public.vehicles OWNER TO postgres;

-- --
-- -- TOC entry 228 (class 1259 OID 16733)
-- -- Name: vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
-- --

-- CREATE SEQUENCE public.vehicles_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE public.vehicles_id_seq OWNER TO postgres;

-- --
-- -- TOC entry 5074 (class 0 OID 0)
-- -- Dependencies: 228
-- -- Name: vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
-- --

-- ALTER SEQUENCE public.vehicles_id_seq OWNED BY public.vehicles.id;


-- --
-- -- TOC entry 4814 (class 2604 OID 16709)
-- -- Name: drivers id; Type: DEFAULT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.drivers ALTER COLUMN id SET DEFAULT nextval('public.drivers_id_seq'::regclass);


-- --
-- -- TOC entry 4826 (class 2604 OID 16841)
-- -- Name: expenses id; Type: DEFAULT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.expenses ALTER COLUMN id SET DEFAULT nextval('public.expenses_id_seq'::regclass);


-- --
-- -- TOC entry 4828 (class 2604 OID 16862)
-- -- Name: fuel_logs id; Type: DEFAULT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.fuel_logs ALTER COLUMN id SET DEFAULT nextval('public.fuel_logs_id_seq'::regclass);


-- --
-- -- TOC entry 4820 (class 2604 OID 16771)
-- -- Name: maintenance_logs id; Type: DEFAULT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.maintenance_logs ALTER COLUMN id SET DEFAULT nextval('public.maintenance_logs_id_seq'::regclass);


-- --
-- -- TOC entry 4806 (class 2604 OID 16643)
-- -- Name: regions id; Type: DEFAULT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.regions ALTER COLUMN id SET DEFAULT nextval('public.regions_id_seq'::regclass);


-- --
-- -- TOC entry 4807 (class 2604 OID 16655)
-- -- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


-- --
-- -- TOC entry 4823 (class 2604 OID 16803)
-- -- Name: trips id; Type: DEFAULT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.trips ALTER COLUMN id SET DEFAULT nextval('public.trips_id_seq'::regclass);


-- --
-- -- TOC entry 4811 (class 2604 OID 16681)
-- -- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


-- --
-- -- TOC entry 4810 (class 2604 OID 16669)
-- -- Name: vehicle_types id; Type: DEFAULT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.vehicle_types ALTER COLUMN id SET DEFAULT nextval('public.vehicle_types_id_seq'::regclass);


-- --
-- -- TOC entry 4817 (class 2604 OID 16737)
-- -- Name: vehicles id; Type: DEFAULT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.vehicles ALTER COLUMN id SET DEFAULT nextval('public.vehicles_id_seq'::regclass);


-- --
-- -- TOC entry 4831 (class 2606 OID 16638)
-- -- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.alembic_version
--     ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


-- --
-- -- TOC entry 4855 (class 2606 OID 16715)
-- -- Name: drivers drivers_license_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.drivers
--     ADD CONSTRAINT drivers_license_number_key UNIQUE (license_number);


-- --
-- -- TOC entry 4857 (class 2606 OID 16713)
-- -- Name: drivers drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.drivers
--     ADD CONSTRAINT drivers_pkey PRIMARY KEY (id);


-- --
-- -- TOC entry 4859 (class 2606 OID 16717)
-- -- Name: drivers drivers_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.drivers
--     ADD CONSTRAINT drivers_user_id_key UNIQUE (user_id);


-- --
-- -- TOC entry 4875 (class 2606 OID 16846)
-- -- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.expenses
--     ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


-- --
-- -- TOC entry 4878 (class 2606 OID 16865)
-- -- Name: fuel_logs fuel_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.fuel_logs
--     ADD CONSTRAINT fuel_logs_pkey PRIMARY KEY (id);


-- --
-- -- TOC entry 4868 (class 2606 OID 16777)
-- -- Name: maintenance_logs maintenance_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.maintenance_logs
--     ADD CONSTRAINT maintenance_logs_pkey PRIMARY KEY (id);


-- --
-- -- TOC entry 4834 (class 2606 OID 16647)
-- -- Name: regions regions_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.regions
--     ADD CONSTRAINT regions_code_key UNIQUE (code);


-- --
-- -- TOC entry 4836 (class 2606 OID 16649)
-- -- Name: regions regions_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.regions
--     ADD CONSTRAINT regions_name_key UNIQUE (name);


-- --
-- -- TOC entry 4838 (class 2606 OID 16645)
-- -- Name: regions regions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.regions
--     ADD CONSTRAINT regions_pkey PRIMARY KEY (id);


-- --
-- -- TOC entry 4841 (class 2606 OID 16663)
-- -- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.roles
--     ADD CONSTRAINT roles_name_key UNIQUE (name);


-- --
-- -- TOC entry 4843 (class 2606 OID 16661)
-- -- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.roles
--     ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


-- --
-- -- TOC entry 4871 (class 2606 OID 16807)
-- -- Name: trips trips_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.trips
--     ADD CONSTRAINT trips_pkey PRIMARY KEY (id);


-- --
-- -- TOC entry 4873 (class 2606 OID 16809)
-- -- Name: trips trips_trip_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.trips
--     ADD CONSTRAINT trips_trip_number_key UNIQUE (trip_number);


-- --
-- -- TOC entry 4851 (class 2606 OID 16689)
-- -- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.users
--     ADD CONSTRAINT users_email_key UNIQUE (email);


-- --
-- -- TOC entry 4853 (class 2606 OID 16687)
-- -- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.users
--     ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- --
-- -- TOC entry 4846 (class 2606 OID 16675)
-- -- Name: vehicle_types vehicle_types_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.vehicle_types
--     ADD CONSTRAINT vehicle_types_name_key UNIQUE (name);


-- --
-- -- TOC entry 4848 (class 2606 OID 16673)
-- -- Name: vehicle_types vehicle_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.vehicle_types
--     ADD CONSTRAINT vehicle_types_pkey PRIMARY KEY (id);


-- --
-- -- TOC entry 4863 (class 2606 OID 16741)
-- -- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.vehicles
--     ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


-- --
-- -- TOC entry 4865 (class 2606 OID 16743)
-- -- Name: vehicles vehicles_registration_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.vehicles
--     ADD CONSTRAINT vehicles_registration_number_key UNIQUE (registration_number);


-- --
-- -- TOC entry 4860 (class 1259 OID 16723)
-- -- Name: ix_drivers_id; Type: INDEX; Schema: public; Owner: postgres
-- --

-- CREATE INDEX ix_drivers_id ON public.drivers USING btree (id);


-- --
-- -- TOC entry 4876 (class 1259 OID 16857)
-- -- Name: ix_expenses_id; Type: INDEX; Schema: public; Owner: postgres
-- --

-- CREATE INDEX ix_expenses_id ON public.expenses USING btree (id);


-- --
-- -- TOC entry 4879 (class 1259 OID 16876)
-- -- Name: ix_fuel_logs_id; Type: INDEX; Schema: public; Owner: postgres
-- --

-- CREATE INDEX ix_fuel_logs_id ON public.fuel_logs USING btree (id);


-- --
-- -- TOC entry 4866 (class 1259 OID 16788)
-- -- Name: ix_maintenance_logs_id; Type: INDEX; Schema: public; Owner: postgres
-- --

-- CREATE INDEX ix_maintenance_logs_id ON public.maintenance_logs USING btree (id);


-- --
-- -- TOC entry 4832 (class 1259 OID 16650)
-- -- Name: ix_regions_id; Type: INDEX; Schema: public; Owner: postgres
-- --

-- CREATE INDEX ix_regions_id ON public.regions USING btree (id);


-- --
-- -- TOC entry 4839 (class 1259 OID 16664)
-- -- Name: ix_roles_id; Type: INDEX; Schema: public; Owner: postgres
-- --

-- CREATE INDEX ix_roles_id ON public.roles USING btree (id);


-- --
-- -- TOC entry 4869 (class 1259 OID 16825)
-- -- Name: ix_trips_id; Type: INDEX; Schema: public; Owner: postgres
-- --

-- CREATE INDEX ix_trips_id ON public.trips USING btree (id);


-- --
-- -- TOC entry 4849 (class 1259 OID 16695)
-- -- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
-- --

-- CREATE INDEX ix_users_id ON public.users USING btree (id);


-- --
-- -- TOC entry 4844 (class 1259 OID 16676)
-- -- Name: ix_vehicle_types_id; Type: INDEX; Schema: public; Owner: postgres
-- --

-- CREATE INDEX ix_vehicle_types_id ON public.vehicle_types USING btree (id);


-- --
-- -- TOC entry 4861 (class 1259 OID 16759)
-- -- Name: ix_vehicles_id; Type: INDEX; Schema: public; Owner: postgres
-- --

-- CREATE INDEX ix_vehicles_id ON public.vehicles USING btree (id);


-- --
-- -- TOC entry 4881 (class 2606 OID 16718)
-- -- Name: drivers drivers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.drivers
--     ADD CONSTRAINT drivers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- --
-- -- TOC entry 4890 (class 2606 OID 16847)
-- -- Name: expenses expenses_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.expenses
--     ADD CONSTRAINT expenses_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id);


-- --
-- -- TOC entry 4891 (class 2606 OID 16852)
-- -- Name: expenses expenses_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.expenses
--     ADD CONSTRAINT expenses_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


-- --
-- -- TOC entry 4892 (class 2606 OID 16866)
-- -- Name: fuel_logs fuel_logs_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.fuel_logs
--     ADD CONSTRAINT fuel_logs_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id);


-- --
-- -- TOC entry 4893 (class 2606 OID 16871)
-- -- Name: fuel_logs fuel_logs_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.fuel_logs
--     ADD CONSTRAINT fuel_logs_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


-- --
-- -- TOC entry 4885 (class 2606 OID 16778)
-- -- Name: maintenance_logs maintenance_logs_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.maintenance_logs
--     ADD CONSTRAINT maintenance_logs_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


-- --
-- -- TOC entry 4886 (class 2606 OID 16783)
-- -- Name: maintenance_logs maintenance_logs_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.maintenance_logs
--     ADD CONSTRAINT maintenance_logs_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


-- --
-- -- TOC entry 4887 (class 2606 OID 16810)
-- -- Name: trips trips_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.trips
--     ADD CONSTRAINT trips_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


-- --
-- -- TOC entry 4888 (class 2606 OID 16815)
-- -- Name: trips trips_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.trips
--     ADD CONSTRAINT trips_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id);


-- --
-- -- TOC entry 4889 (class 2606 OID 16820)
-- -- Name: trips trips_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.trips
--     ADD CONSTRAINT trips_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


-- --
-- -- TOC entry 4880 (class 2606 OID 16690)
-- -- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.users
--     ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


-- --
-- -- TOC entry 4882 (class 2606 OID 16744)
-- -- Name: vehicles vehicles_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.vehicles
--     ADD CONSTRAINT vehicles_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


-- --
-- -- TOC entry 4883 (class 2606 OID 16749)
-- -- Name: vehicles vehicles_region_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.vehicles
--     ADD CONSTRAINT vehicles_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.regions(id);


-- --
-- -- TOC entry 4884 (class 2606 OID 16754)
-- -- Name: vehicles vehicles_vehicle_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
-- --

-- ALTER TABLE ONLY public.vehicles
--     ADD CONSTRAINT vehicles_vehicle_type_id_fkey FOREIGN KEY (vehicle_type_id) REFERENCES public.vehicle_types(id);


-- -- Completed on 2026-07-12 11:11:08

-- --
-- -- PostgreSQL database dump complete
-- --

-- \unrestrict 5kgLJ3uPmOeHY1tWkneUcdygVDGPzTfmsE5KtnGrsHl5t8czAi7VOm4StqcIhVK

