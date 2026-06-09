-- ONE LDN PT Matcher — Seed Data v4
-- Source of truth: one-ldn-pt-matcher-updated.jsx PT_ROSTER array
-- 11 coaches with real questionnaire data
-- Harry (5), Kayla (6), Adam (8) removed — no questionnaire response
-- IDs are intentionally sparse; do not renumber
-- Run after schema.sql

truncate table pt_roster restart identity cascade;

insert into pt_roster
  (id, name, role, specialisms, populations, best_for, gender, tier, capacity, current_load, rate, initials, active)
values

(1,  'CRAIG',  'Osteopath & S&C Coach',
  '["rehab","injury","longevity","health_mgmt","advanced"]',
  '["advanced","rehab","intermediate","older_adults","corporate"]',
  'Return to sport, break through perceived limits and perform without fear of injury. Clinical diagnosis meets progressive strength training.',
  'male', 'SENIOR', 3, 0, 125, 'CR', true),

(2,  'JESS',   'Strength Coach & Women''s Health PT',
  '["strength","body_composition","pre_postnatal","womens_health","recomposition"]',
  '["womens_health","beginners","intermediate","corporate"]',
  'Structured strength training for body composition and lean muscle growth. Specialist in women''s health, pre/postnatal and long-term body confidence.',
  'female', 'SPECIALIST', 5, 0, 80, 'JE', true),

(3,  'MAX',    'Martial Arts Instructor & PT',
  '["boxing","martial_arts","mobility","strength","conditioning"]',
  '["beginners","older_adults","teens","corporate","rehab"]',
  'Boxing, Muay Thai, Kickboxing and mobility coaching. Combat skills meet structured strength programming for all levels.',
  'male', 'SPECIALIST', 4, 0, 110, 'MX', true),

(4,  'MARA',   'Personal Trainer',
  '["running","hyrox","injury_prevention","functional","conditioning"]',
  '["runners","hyrox","intermediate","beginners","older_adults","corporate","rehab"]',
  'Running performance, HYROX prep and injury-resilient training. Functional strength with longevity always considered.',
  'female', 'SPECIALIST', 6, 0, 90, 'MA', true),

(7,  'ALICE',  'Coach & Personal Trainer',
  '["womens_health","strength","hypertrophy","pre_postnatal","recomposition","rehab"]',
  '["womens_health","beginners","intermediate","older_adults","corporate","rehab"]',
  'Biomechanics and hypertrophy for women. Builds strength and lasting body confidence through technically precise, progressive programming.',
  'female', 'ASSOCIATE', 5, 0, 105, 'AL', true),

(9,  'SAM',    'Performance Coach',
  '["sport_specific","rehab","power","speed","athletic_performance"]',
  '["advanced","rehab","sport_specific"]',
  'Athletic performance and injury rehab for serious athletes. Premier League background in power, speed and sports-specific S&C.',
  'male', 'SENIOR', 8, 0, 150, 'SA', true),

(10, 'AIMEE',  'Personal Trainer',
  '["strength","recomposition","womens_health","nutrition","body_composition"]',
  '["womens_health","beginners","intermediate","older_adults","corporate"]',
  'Strength and body composition coaching for women, with specialist support for midlife and hormonal health.',
  'female', 'SPECIALIST', 5, 0, 95, 'AI', true),

(11, 'LUCAS',  'Performance Coach & PT',
  '["strength","hyrox","running","endurance","body_composition","conditioning"]',
  '["hyrox","runners","beginners","intermediate","advanced","corporate"]',
  'Strength, HYROX and endurance coaching. Structured training for performance goals — getting faster, stronger and leaner with a multi-discipline approach.',
  'male', 'ASSOCIATE', 6, 0, 100, 'LU', true),

(12, 'GRACE',  'Personal Trainer',
  '["body_composition","recomposition","hypertrophy","strength","beginners"]',
  '["beginners","intermediate","womens_health","corporate"]',
  'Structured physique transformations — body composition, muscle building and recomposition with realistic, lasting results.',
  'female', 'ASSOCIATE', 7, 0, 100, 'GR', false),  -- active=false: awaiting first clients, flag as pending

(13, 'ADRIAN', 'Coach & Personal Trainer',
  '["weightlifting","strength","body_composition","conditioning","hyrox","crossfit","recomposition"]',
  '["beginners","intermediate","advanced","hyrox","older_adults","corporate","teens"]',
  'Olympic weightlifting, body transformations and strength coaching. Technical lifting and high-output conditioning with 10 years of coaching experience.',
  'male', 'ASSOCIATE', 7, 0, 88, 'AC', true),

(14, 'ANNIE',  'Coach & Personal Trainer',
  '["hyrox","conditioning","strength","functional","endurance"]',
  '["hyrox","beginners","intermediate","advanced","runners","older_adults","corporate"]',
  'HYROX, Turf Games and hybrid training. Breaks training plateaus and builds real fitness and strength — structured programming that makes you feel both fit and strong.',
  'female', 'ASSOCIATE', 6, 0, 100, 'AH', true);
