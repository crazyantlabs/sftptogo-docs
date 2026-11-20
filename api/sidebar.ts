import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "sftp-to-go-management-api",
    },
    {
      type: "category",
      label: "Credentials",
      link: {
        type: "doc",
        id: "credentials",
      },
      items: [
        {
          type: "doc",
          id: "list-credentials",
          label: "List credentials",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "create-credential",
          label: "Create a credential",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "check-credential-name",
          label: "Check a login name",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "get-credential",
          label: "Retrieve a credential",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "update-credential",
          label: "Update a credential",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "delete-credential",
          label: "Delete a credential",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "activate-credential",
          label: "Activate a credential",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "deactivate-credential",
          label: "Deactivate a credential",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "rotate-credential-password",
          label: "Rotate or set a password",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "send-credential-email-verification",
          label: "Send an email verification",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
