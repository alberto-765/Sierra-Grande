import type { Schema, Attribute } from '@strapi/strapi';

export interface HeaderSeccionSuperior extends Schema.Component {
  collectionName: 'components_header_seccion_superiors';
  info: {
    displayName: 'Secci\u00F3n superior';
    description: '';
  };
  attributes: {
    Titulo: Attribute.String & Attribute.Required;
    Descripcion: Attribute.String & Attribute.Required;
    Orden: Attribute.Integer & Attribute.Required & Attribute.DefaultTo<1>;
    Icono: Attribute.String & Attribute.CustomField<'plugin::react-icons.icon'>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'header.seccion-superior': HeaderSeccionSuperior;
    }
  }
}
