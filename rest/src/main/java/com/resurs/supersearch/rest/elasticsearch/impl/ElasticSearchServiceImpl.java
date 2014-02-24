package com.resurs.supersearch.rest.elasticsearch.impl;

import com.resurs.supersearch.rest.elasticsearch.ElasticSearchService;
import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.ImmutableSettings;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

/**
 * Created by Trind on 2014-02-22.
 */
@Service
public class ElasticSearchServiceImpl implements ElasticSearchService {


    @Value("${supersearch.elastic.host}")
    private String host;
    @Value("${supersearch.elastic.clustername}")
    private String clusterName;

    private Boolean clientIgnoreClusterName = Boolean.FALSE;
    private String clientPingTimeout = "5s";
    private String clientNodesSamplerInterval = "5s";
    private TransportClient client;
    static final String COLON = ":";
    static final String COMMA = ",";


    public ElasticSearchServiceImpl()  {


    }

    @PostConstruct
    private void onLoad() throws Exception {
        buildClient();

    }


    private Settings settings() {
        return ImmutableSettings.settingsBuilder()
                .put("cluster.name", clusterName)
                .put("client.transport.ignore_cluster_name", clientIgnoreClusterName)
                .put("client.transport.ping_timeout", clientPingTimeout)
                .put("client.transport.nodes_sampler_interval", clientNodesSamplerInterval)
                .build();
    }

    protected synchronized void buildClient() throws Exception {
        client = new TransportClient(settings());
        for (String clusterNode : StringUtils.split(host, COMMA)) {
            String hostName = StringUtils.substringBefore(clusterNode, COLON);
            String port = StringUtils.substringAfter(clusterNode, COLON);
            client.addTransportAddress(new InetSocketTransportAddress(hostName, Integer.valueOf(port)));
        }
        client.connectedNodes();
    }

    public Client getClient() {
        //check if client is null or if it ain't opened.
        if (client == null) {
            try {
                buildClient();
            } catch (Exception e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
        } else if (client.connectedNodes().size() == 0) {
            try {
                buildClient();
            } catch (Exception e) {
                e.printStackTrace();
            }

        }
        return client;
    }

}
