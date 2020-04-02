CREATE TABLE news(
    news_id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    news VARCHAR(255),
    news_status VARCHAR(255)
);

CREATE TABLE admins(
    admin_id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    hash_pass VARCHAR(255),
    authorized BOOLEAN NOT NULL
);