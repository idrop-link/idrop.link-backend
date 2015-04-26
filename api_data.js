define({ "api": [
  {
    "type": "get",
    "url": "/",
    "title": "API entry point",
    "name": "GetRoot",
    "group": "API",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "_links",
            "description": "<p>available links from the endpoint</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 OK\n{\n    \"_links\": {\n        \"self\": {\n            \"href\": \"/api\"\n        },\n        \"v1\": {\n            \"href\": \"/api/v1\"\n        }\n    }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/index.js",
    "groupTitle": "API"
  },
  {
    "type": "get",
    "url": "/",
    "title": "API entry point of first api version",
    "name": "GetRootFirstVersion",
    "group": "APIv1",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "200",
            "description": "<p>OK</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_links\":{\n        \"self\":{\n            \"href\":\"/api/v1\"\n        },\n        \"users\":{\n            \"href\":\"/api/v1/users\"\n         }\n    }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/v1/index.js",
    "groupTitle": "APIv1"
  },
  {
    "type": "post",
    "url": "/users",
    "title": "Create User",
    "name": "CreateUser",
    "group": "User",
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>the users id</p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>contains the error description</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>unique email address</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>the users password</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/v1/users/index.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/users/:id/authenticate",
    "title": "Create Token for a User",
    "name": "CreateUserToken",
    "group": "User",
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "message",
            "description": "<p>bad request</p> "
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "message",
            "description": "<p>unauthorized</p> "
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "message",
            "description": "<p>no such user</p> "
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "message",
            "description": "<p>error while generating token</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "token",
            "description": "<p>the requested token</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>unique email address</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>the users password</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/v1/users/index.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/users/:id/deauthenticate",
    "title": "Log out",
    "name": "DeauthenticateUser",
    "group": "User",
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "message",
            "description": "<p>bad request</p> "
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "message",
            "description": "<p>unauthorized</p> "
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "message",
            "description": "<p>no such user</p> "
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "message",
            "description": "<p>error while generating token</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "token",
            "description": "<p>the requested token</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/v1/users/index.js",
    "groupTitle": "User"
  },
  {
    "type": "delete",
    "url": "/users/:id",
    "title": "Delete User",
    "name": "DeleteUser",
    "group": "User",
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "message",
            "description": "<p>id and email do not match</p> "
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "message",
            "description": "<p>unauthorized</p> "
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "message",
            "description": "<p>user with id not found</p> "
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "message",
            "description": "<p>error while removing user</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "message",
            "description": "<p>removed user</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/v1/users/index.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/:id",
    "title": "Lookup User",
    "name": "GetUser",
    "group": "User",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>id of the user</p> "
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>of the user</p> "
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "creation_date",
            "description": "<p>when the user was created</p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>bad request (missing token probably)</p> "
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>unauthorized</p> "
          }
        ],
        "404": [
          {
            "group": "404",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>no such user</p> "
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>something went wrong</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/v1/users/index.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/:email/idformail",
    "title": "Get User ID by email",
    "name": "GetUserMailByID",
    "group": "User",
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "message",
            "description": "<p>id and email do not match</p> "
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "message",
            "description": "<p>unauthorized</p> "
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "message",
            "description": "<p>user with email not found</p> "
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "message",
            "description": "<p>error</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>the users id</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>unique email address</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>the users password</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/v1/users/index.js",
    "groupTitle": "User"
  },
  {
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": ""
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "api/v1/users/index.js",
    "group": "_Users_cocoanaut_Documents_Development_idrop_link_idrop_link_backend_api_v1_users_index_js",
    "groupTitle": "_Users_cocoanaut_Documents_Development_idrop_link_idrop_link_backend_api_v1_users_index_js",
    "name": ""
  }
] });