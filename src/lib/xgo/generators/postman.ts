import { IVersion, VersionType } from "@/lib/models/version";
import { IModelData } from "@/lib/types/xgo/models";
import fs from "fs";
import path from "path";
import { Node } from "reactflow";
import util from "util";

const writeFilePromise = util.promisify(fs.writeFile);

const postmanApiKey = process.env.POSTMAN_API_KEY;
const collectionPath = "./postman-collection.json";

export const publishCollection = async (collectionId: string) => {
  // Collection'ı public yap
  const publicDocResponse = await fetch(
    `https://api.getpostman.com/collections/${collectionId}/public`,
    {
      method: "PUT",
      headers: {
        "X-Api-Key": postmanApiKey as string,
        "Content-Type": "application/json",
      },
    }
  );

  const publicDocBody = await publicDocResponse.json();
  console.log("Public Doc Response:", publicDocBody);

  if (publicDocBody.error) {
    throw new Error(publicDocBody.error.message);
  }

  const publicUrl = `https://www.postman.com/collections/${collectionId}`;
  console.log("Public Documentation URL:", publicUrl);

  return {
    collectionId,
    publicUrl,
  };
};

export async function uploadCollection() {
  if (!postmanApiKey) {
    throw new Error("POSTMAN_API_KEY is not defined");
  }

  const collectionData = JSON.parse(fs.readFileSync(collectionPath, "utf-8"));

  const requestBody = {
    collection: collectionData,
  };

  console.log({ collectionData });

  const response = await fetch("https://api.getpostman.com/collections", {
    method: "POST",
    headers: {
      "X-Api-Key": postmanApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const collectionBody = await response.json();

  console.log("Collection Upload Response:", collectionBody);

  if (collectionBody.error) {
    throw new Error(collectionBody.error.message);
  }

  const collectionId = collectionBody.collection.id;
  console.log("Collection ID:", collectionId);
}

export function getPostmanItem(nodes: Node<IModelData>[]): any[] {
  const methods = ["GET", "GETID", "POST", "PUT", "DELETE"];
  const header = [
    {
      key: "Content-Type",
      value: "application/json",
    },
  ];
  const authHeader = [
    ...header,
    {
      key: "Authorization",
      value: "Bearer {{token}}",
    },
  ];
  const modelRoutes = nodes
    .map((model) => {
      const routeName = model.data.name.toLowerCase();

      const rawBody: any = {};
      model.data.schemas.forEach((field) => {
        rawBody[field.name] = `{{${field.name}}}`;
      });
      return {
        name: routeName,
        type: "folder",
        description: `${model.data.name} endpoints`,
        item: methods.map((method) => {
          switch (method) {
            case "GET":
              return {
                name: `all ${routeName}s`,
                description: `Get all ${routeName}s`,
                request: {
                  method: method,
                  url: `{{baseUrl}}/${routeName}s`,
                  header: authHeader,
                },
              };
            case "POST":
              return {
                name: `create ${routeName}`,
                description: `Create a ${routeName}`,
                request: {
                  method: method,
                  url: `{{baseUrl}}/${routeName}s`,
                  header: authHeader,
                  body: {
                    mode: "raw",
                    raw: JSON.stringify(rawBody),
                  },
                },
              };
            case "GETID":
              return {
                name: `get ${routeName} by id`,
                description: `Get a ${routeName} by id`,
                request: {
                  method: "GET",
                  url: `{{baseUrl}}/${routeName}s/:id`,
                  header: authHeader,
                },
              };
            case "PUT":
              return {
                name: `update ${routeName}`,
                description: `Update a ${routeName}`,
                request: {
                  method: method,
                  url: `{{baseUrl}}/${routeName}s/:id`,
                  header: authHeader,
                  body: {
                    mode: "raw",
                    raw: JSON.stringify(rawBody),
                  },
                },
              };
            case "DELETE":
              return {
                name: `delete ${routeName}`,
                description: `Delete a ${routeName}`,
                request: {
                  method: method,
                  url: `{{baseUrl}}/${routeName}s/:id`,
                  header: authHeader,
                },
              };
          }
        }),
      };
    })
    .flat();

  const authRoutes = {
    name: "auth",
    type: "folder",
    description: "Authentication endpoints",
    item: [
      {
        name: "login",
        description: "Login to the API",
        request: {
          method: "POST",
          url: `{{baseUrl}}/login`,
          header,
          body: {
            mode: "raw",
            raw: JSON.stringify({
              email: "{{email}}",
              password: "{{password}}",
            }),
          },
          script: {
            type: "text/javascript",
            exec: [
              "postman.setEnvironmentVariable('token', responseBody.token);",
            ],
          },
        },
      },
      {
        name: "register",
        description: "Register to the API",
        request: {
          method: "POST",
          url: `{{baseUrl}}/register`,
          header,
          body: {
            mode: "raw",
            raw: JSON.stringify({
              fullname: "{{fullname}}",
              email: "{{email}}",
              password: "{{password}}",
            }),
          },
          script: {
            type: "text/javascript",
            exec: [
              "postman.setEnvironmentVariable('token', responseBody.token);",
            ],
          },
        },
      },
      {
        name: "logout",
        description: "Logout from the API",
        request: {
          method: "GET",
          url: `{{baseUrl}}/logout`,
          header: authHeader,
        },
      },
      {
        name: "me",
        description: "Get the current user",
        request: {
          method: "GET",
          url: `{{baseUrl}}/me`,
          header: authHeader,
        },
      },
    ],
  };

  return [authRoutes, ...modelRoutes];
}

export async function buildPostmanCollection(
  projectPath: string,
  projectName: string,
  activeVersion: IVersion<VersionType.MODEL>
) {
  const item = getPostmanItem(activeVersion.nodes);

  // implement the model routes to postman collection
  const collection = {
    info: {
      name: projectName,
      description: activeVersion.name,
      schema:
        "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    item,
    variables: [
      {
        key: "baseUrl",
        value: "{{baseUrl}}",
        type: "string",
      },
      {
        key: "token",
        value: "{{token}}",
        type: "string",
      },
      {
        key: "email",
        value: "{{email}}",
        type: "string",
      },
      {
        key: "password",
        value: "{{password}}",
        type: "string",
      },
    ],
  };

  console.log({ collection });

  await writeFilePromise(
    path.join(process.cwd(), "postman-collection.json"),
    JSON.stringify(collection, null, 2)
  );

  // await uploadCollection();
}
