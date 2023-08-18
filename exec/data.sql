drop database if exists grabthebeat;
create database grabthebeat;


    alter table record 
       drop 
       foreign key FKeny3549xar8rnrcmdw3hl0la1
    
    drop table if exists record
    
    drop table if exists refresh_token
    
    drop table if exists room
    
    drop table if exists user
    
    create table record (
       record_id integer not null auto_increment,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP not null,
        good_count integer,
        max_combo integer,
        miss_count integer,
        music_title varchar(255),
        perfect_count integer,
        score integer,
        user_id bigint,
        primary key (record_id)
    ) engine=InnoDB
    
    create table refresh_token (
       refresh_token_id bigint not null auto_increment,
        refresh_token varchar(255) not null,
        user_id bigint not null,
        primary key (refresh_token_id)
    ) engine=InnoDB
    
    create table room (
       room_id integer not null auto_increment,
        alive bit,
        code varchar(6),
        player_count integer,
        playing bit,
        primary key (room_id)
    ) engine=InnoDB
    
    create table user (
       user_id bigint not null auto_increment,
        email varchar(255) not null,
        nickname varchar(255),
        password varchar(255),
        primary key (user_id)
    ) engine=InnoDB
    
    alter table refresh_token 
       add constraint UK_f95ixxe7pa48ryn1awmh2evt7 unique (user_id)
    
    alter table user 
       add constraint UK_ob8kqyqqgmefl0aco34akdtpe unique (email)
    
    alter table user 
       add constraint UK_n4swgcf30j6bmtb4l4cjryuym unique (nickname)
    
    alter table record 
       add constraint FKeny3549xar8rnrcmdw3hl0la1 
       foreign key (user_id) 
       references user (user_id)
