CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login_at TIMESTAMPTZ
);

CREATE TABLE user_profile (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(120) NOT NULL,
    cefr_level VARCHAR(3) NOT NULL DEFAULT 'B1',
    falow_level INTEGER NOT NULL DEFAULT 1,
    total_xp INTEGER NOT NULL DEFAULT 0,
    streak_days INTEGER NOT NULL DEFAULT 0,
    study_minutes INTEGER NOT NULL DEFAULT 0,
    assessment_completed BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT user_profile_cefr_check CHECK (cefr_level IN ('A1','A2','B1','B1+','B2','B2+','C1','C1+','C2'))
);

CREATE TABLE user_skills (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_key VARCHAR(32) NOT NULL,
    cefr_level VARCHAR(3) NOT NULL DEFAULT 'B1',
    mastery_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, skill_key)
);

CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_key VARCHAR(120) NOT NULL UNIQUE,
    skill_key VARCHAR(32) NOT NULL,
    title VARCHAR(180) NOT NULL,
    objective TEXT NOT NULL,
    level VARCHAR(3) NOT NULL,
    base_xp INTEGER NOT NULL DEFAULT 10,
    content JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE activity_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL,
    score NUMERIC(5,2) NOT NULL,
    awarded_xp INTEGER NOT NULL DEFAULT 0,
    answer JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, activity_id, attempt_number)
);

CREATE TABLE xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_attempt_id UUID REFERENCES activity_attempts(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL,
    reason VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE recurring_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_key VARCHAR(120) NOT NULL UNIQUE,
    category VARCHAR(80) NOT NULL,
    title VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(16) NOT NULL DEFAULT 'medium'
);

CREATE TABLE user_errors (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    error_id UUID NOT NULL REFERENCES recurring_errors(id) ON DELETE CASCADE,
    occurrences INTEGER NOT NULL DEFAULT 0,
    corrected_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'Needs review',
    first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, error_id)
);

CREATE TABLE assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    previous_level VARCHAR(3) NOT NULL,
    new_level VARCHAR(3) NOT NULL,
    score NUMERIC(5,2) NOT NULL,
    evidence JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_type VARCHAR(32) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    summary JSONB
);

CREATE INDEX activity_attempts_user_created_idx ON activity_attempts(user_id, created_at DESC);
CREATE INDEX xp_transactions_user_created_idx ON xp_transactions(user_id, created_at DESC);
CREATE INDEX user_errors_review_idx ON user_errors(user_id, status, last_seen_at DESC);
