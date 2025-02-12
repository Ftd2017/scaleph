create database if not exists scaleph default character set utf8mb4 collate utf8mb4_unicode_ci;
use scaleph;

/* flink release */
DROP TABLE IF EXISTS flink_release;
CREATE TABLE `flink_release`
(
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '自增主键',
    `version`     VARCHAR(255) NOT NULL COMMENT '版本',
    `file_name`   VARCHAR(255) NOT NULL COMMENT '文件名称',
    `path`        VARCHAR(255) NOT NULL COMMENT '存储路径',
    `remark`      VARCHAR(255) COMMENT '备注',
    `creator`     VARCHAR(32) COMMENT '创建人',
    `create_time` TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `editor`      VARCHAR(32) COMMENT '修改人',
    `update_time` TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE = INNODB COMMENT = 'flink release';

/* flink 部署配置文件 */
DROP TABLE IF EXISTS flink_deploy_config_file;
CREATE TABLE flink_deploy_config_file
(
    id          BIGINT      NOT NULL AUTO_INCREMENT COMMENT '自增主键',
    config_type VARCHAR(4)  NOT NULL COMMENT '配置文件类型。0: hadoop conf, 1: kubeconfig, 2: flink-conf.yaml',
    `name`      VARCHAR(64) NOT NULL COMMENT '配置名称',
    remark      VARCHAR(256) COMMENT '备注',
    creator     VARCHAR(32) COMMENT '创建人',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    editor      VARCHAR(32) COMMENT '修改人',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (id)
) ENGINE = INNODB COMMENT = 'flink 部署配置文件';

/* flink 集群配置 */
DROP TABLE IF EXISTS flink_cluster_config;
CREATE TABLE `flink_cluster_config`
(
    `id`                    BIGINT       NOT NULL AUTO_INCREMENT COMMENT '自增主键',
    `name`                  VARCHAR(255) NOT NULL COMMENT '名称',
    `flink_version`         VARCHAR(32)  NOT NULL COMMENT '集群版本',
    `resource_provider`     VARCHAR(4)   NOT NULL COMMENT 'Resource。0: Standalone, 1: Native Kubernetes, 2: YARN',
    `deploy_mode`           VARCHAR(4)   NOT NULL COMMENT 'flink 部署模式。0: Application, 1: Per-Job, 2: Session',
    `flink_release_id`      BIGINT       NOT NULL COMMENT 'release id',
    `deploy_config_file_id` BIGINT COMMENT '配置文件 id。配置如 hadoop 的 core-site.xml，kubernetes 的 kubeconfig',
    `config_options`        TEXT COMMENT '集群配置',
    `remark`                VARCHAR(256) COMMENT '备注',
    `creator`               VARCHAR(32) COMMENT '创建人',
    `create_time`           TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `editor`                VARCHAR(32) COMMENT '修改人',
    `update_time`           TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE = INNODB COMMENT = 'flink 集群配置';

/* flink 集群实例 */
DROP TABLE IF EXISTS flink_cluster_instance;
CREATE TABLE `flink_cluster_instance`
(
    `id`                      BIGINT       NOT NULL AUTO_INCREMENT COMMENT '自增主键',
    `flink_cluster_config_id` BIGINT       NOT NULL COMMENT '集群配置',
    `name`                    VARCHAR(255) NOT NULL COMMENT '集群名称',
    `cluster_id`              VARCHAR(64)  NOT NULL DEFAULT '' COMMENT '集群id',
    `web_interface_url`       VARCHAR(255) NOT NULL COMMENT '集群 web-ui 链接',
    `status`                  TINYINT      NOT NULL COMMENT '集群状态。0: 停止, 1: 运行',
    `remark`                  VARCHAR(256)          DEFAULT NULL COMMENT '备注',
    `creator`                 VARCHAR(32) COMMENT '创建人',
    `create_time`             TIMESTAMP             DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `editor`                  VARCHAR(32) COMMENT '修改人',
    `update_time`             TIMESTAMP             DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`),
    KEY idx_flink_cluster_config_id (`flink_cluster_config_id`)
) ENGINE = INNODB COMMENT = 'flink 集群实例';

/* flink artifact */
DROP TABLE IF EXISTS flink_artifact;
CREATE TABLE flink_artifact
(
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '自增主键',
    `name`        VARCHAR(255) NOT NULL COMMENT '名称',
    `path`        VARCHAR(255) NOT NULL COMMENT '存储路径',
    `entry_class` VARCHAR(255) COMMENT 'entry point class',
    `remark`      VARCHAR(255) COMMENT '备注',
    `creator`     VARCHAR(32) COMMENT '创建人',
    `create_time` TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `editor`      VARCHAR(32) COMMENT '修改人',
    `update_time` TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE = INNODB COMMENT = 'flink artifact';

