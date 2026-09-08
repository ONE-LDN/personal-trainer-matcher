-- Ensure leads.phone exists.
--
-- schema.sql has declared `phone text` on the leads table since v3, so any
-- database created from that file already has the column. This migration is
-- idempotent insurance for a Supabase project whose leads table was created
-- from an earlier schema version. Safe to run repeatedly.

alter table leads add column if not exists phone text;
