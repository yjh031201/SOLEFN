USE shoe;

    CREATE TABLE IF NOT EXISTS USER(
        ID int auto_increment primary key,

        EMAIL varchar(255),
        PASSWORD varchar(100),
        NAME varchar(100),
        REGDATE datetime,
        unique key (EMAIL)
    )engine=InnoDB character set = utf8;

CREATE TABLE IF NOT EXISTS recent_views (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    user_id       BIGINT       NOT NULL,
    product_id    VARCHAR(100) NOT NULL,
    title         VARCHAR(500) NOT NULL,
    image         VARCHAR(500),
    price         VARCHAR(50),
    mall_name     VARCHAR(100),
    brand         VARCHAR(100),
    link          VARCHAR(1000),
    viewed_at     DATETIME(6)  NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_product (user_id, product_id),
    INDEX idx_user_viewed (user_id, viewed_at DESC),
    CONSTRAINT fk_recent_views_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/* 테스트 데이터 */
    INSERT INTO USER(EMAIL, PASSWORD, NAME, REGDATE)
    VALUES ('a@a.com', '1234', 'AAA', now());
