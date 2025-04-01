FROM solr:9.8.1

WORKDIR /opt/solr

COPY ./compose/local/sorl/entrypoint /entrypoint
RUN sed -i 's/\r$//g' /entrypoint
RUN chmod +x /entrypoint

# Expose Solr port
EXPOSE 8983

ENTRYPOINT ["/entrypoint"]


CMD [ "solr", "start" ]
