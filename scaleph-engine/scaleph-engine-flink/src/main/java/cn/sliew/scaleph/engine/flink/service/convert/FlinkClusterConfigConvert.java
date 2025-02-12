/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package cn.sliew.scaleph.engine.flink.service.convert;

import cn.sliew.milky.common.util.JacksonUtil;
import cn.sliew.scaleph.common.constant.DictConstants;
import cn.sliew.scaleph.common.convert.BaseConvert;
import cn.sliew.scaleph.dao.entity.master.flink.FlinkClusterConfig;
import cn.sliew.scaleph.engine.flink.service.dto.FlinkClusterConfigDTO;
import cn.sliew.scaleph.system.service.convert.DictVoConvert;
import cn.sliew.scaleph.system.service.vo.DictVO;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.BeanUtils;
import org.springframework.util.StringUtils;

import java.util.Map;

@Mapper(uses = {}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FlinkClusterConfigConvert extends BaseConvert<FlinkClusterConfig, FlinkClusterConfigDTO> {
    FlinkClusterConfigConvert INSTANCE = Mappers.getMapper(FlinkClusterConfigConvert.class);

    @Override
    default FlinkClusterConfig toDo(FlinkClusterConfigDTO dto) {
        FlinkClusterConfig entity = new FlinkClusterConfig();
        BeanUtils.copyProperties(dto, entity);
        entity.setFlinkVersion(DictVoConvert.INSTANCE.toDo(dto.getFlinkVersion()));
        entity.setResourceProvider(DictVoConvert.INSTANCE.toDo(dto.getResourceProvider()));
        entity.setDeployMode(DictVoConvert.INSTANCE.toDo(dto.getDeployMode()));
        entity.setConfigOptions(JacksonUtil.toJsonString(dto.getConfigOptions()));
        return entity;
    }

    @Override
    default FlinkClusterConfigDTO toDto(FlinkClusterConfig entity) {
        FlinkClusterConfigDTO dto = new FlinkClusterConfigDTO();
        BeanUtils.copyProperties(entity, dto);
        dto.setFlinkVersion(DictVO.toVO(DictConstants.FLINK_VERSION, entity.getFlinkVersion()));
        dto.setResourceProvider(DictVO.toVO(DictConstants.FLINK_RESOURCE_PROVIDER, entity.getResourceProvider()));
        dto.setDeployMode(DictVO.toVO(DictConstants.FLINK_DEPLOYMENT_MODE, entity.getDeployMode()));
        if (StringUtils.hasText(entity.getConfigOptions())) {
            dto.setConfigOptions(JacksonUtil.parseJsonString(entity.getConfigOptions(), Map.class));
        }
        return dto;
    }
}
