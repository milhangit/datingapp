import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
    branch,
    clientId: process.env.TINA_CLIENT_ID, // Get this from tina.io
    token: process.env.TINA_TOKEN, // Get this from tina.io

    build: {
        outputFolder: "admin",
        publicFolder: "client/public",
    },
    media: {
        tina: {
            mediaRoot: "uploads",
            publicFolder: "client/public",
        },
    },
    schema: {
        collections: [
            {
                name: "onboarding",
                label: "Onboarding Questions",
                path: "content/onboarding",
                fields: [
                    {
                        type: "string",
                        name: "question",
                        label: "Question",
                        required: true,
                    },
                    {
                        type: "string",
                        name: "type",
                        label: "Input Type",
                        options: ["text", "select", "radio"],
                        required: true,
                    },
                    {
                        type: "string",
                        name: "options",
                        label: "Options (comma separated)",
                        list: true,
                    },
                ],
            },
            {
                name: "legal",
                label: "Legal Pages",
                path: "content/legal",
                fields: [
                    {
                        type: "string",
                        name: "title",
                        label: "Title",
                        isTitle: true,
                        required: true,
                    },
                    {
                        type: "rich-text",
                        name: "body",
                        label: "Body",
                        isBody: true,
                    },
                ],
            },
        ],
    },
});
