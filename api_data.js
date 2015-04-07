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
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>contains the success description</p> "
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
            "field": "error",
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
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "error",
            "description": "<p>unauthorized</p> "
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "error",
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
            "description": "<p>for the user</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/v1/users/index.js",
    "groupTitle": "User"
  }
] });