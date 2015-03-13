<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="org.jahia.services.content.nodetypes.NodeTypeRegistry" %>
<%@ page import="org.jahia.services.content.nodetypes.ExtendedNodeType" %>
<%@ page import="javax.jcr.nodetype.NodeType" %>
<%@ page import="javax.jcr.nodetype.NodeTypeIterator" %>
<%@ page import="org.apache.commons.collections.IteratorUtils" %>
<%@ page import="java.util.Comparator" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Collections" %>
<%@ page import="org.jahia.services.content.nodetypes.ExtendedPropertyDefinition" %>

<%
    // Generate a CSV with the following format => module ; type ; namespace ;  description ; super type ; properties ; is mixin ?; is abstract ?
    out.println("module;type;namespace;description;supertype;properties;mixin;abstract");

    final NodeTypeRegistry nodeTypeRegistry = NodeTypeRegistry.getInstance();
    List<String> moduleNameList = nodeTypeRegistry.getSystemIds();

    // for all modules
    for (String moduleName : moduleNameList) {
        NodeTypeIterator nodeTypes = nodeTypeRegistry.getNodeTypes(moduleName);
        List<ExtendedNodeType> nodeTypeList = IteratorUtils.toList(nodeTypes);

        // for all type node definition
        for (ExtendedNodeType type : nodeTypeList) {

            // Concat super type
            String superTypeConcat = "";
            for (String superType : type.getDeclaredSupertypeNames()) {
                if(superTypeConcat.length() > 0) {
                    superTypeConcat += "|";
                }
                superTypeConcat += superType;
            }

            // Concat property
            String propertyConcat = "";
            for (ExtendedPropertyDefinition property : type.getPropertyDefinitions()) {
                // we only take properties that are really declare on the type !
                if(property.getDeclaringNodeType().getName().equals(type.getName())) {
                    if (propertyConcat.length() > 0) {
                        propertyConcat += "|";
                    }
                    propertyConcat += property.getName();
                    propertyConcat += " ( ";
                    propertyConcat += javax.jcr.PropertyType.nameFromValue(property.getRequiredType());
                    propertyConcat += " ) ";
                }
            }
            
            String namespace = type.getNameObject().getPrefix() + "@" + type.getNameObject().getUri();
            
            out.println(moduleName + ";" + type.getName() + ";" + namespace + ";" + type.getDescription(java.util.Locale.ENGLISH) + ";" + superTypeConcat + ";" + propertyConcat + ";" + type.isMixin() + ";" + type.isAbstract());
        }
    }
%>