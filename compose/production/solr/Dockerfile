FROM solr:9.8.1

# Create directory for custom configuration
USER root
RUN mkdir -p /opt/solr/server/solr/configsets/oscar_config
COPY ./compose/local/solr/schema.xml /opt/solr/server/solr/configsets/oscar_config/conf/
COPY ./compose/local/solr/solrconfig.xml /opt/solr/server/solr/configsets/oscar_config/conf/

# Copy other necessary Solr config files from default config
RUN cp -r /opt/solr/server/solr/configsets/_default/conf/* /opt/solr/server/solr/configsets/oscar_config/conf/ && \
    rm -f /opt/solr/server/solr/configsets/oscar_config/conf/managed-schema

# Set permissions
RUN chown -R solr:solr /opt/solr/server/solr/configsets/oscar_config

USER solr

CMD ["solr-precreate", "oscar", "/opt/solr/server/solr/configsets/oscar_config"]
