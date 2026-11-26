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
          label: "List all credentials",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "create-credentials",
          label: "Create credentials",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "check-credentials-name",
          label: "Check a login name",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "get-credentials",
          label: "Retrieve credentials",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "update-credentials",
          label: "Update credentials",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "delete-credentials",
          label: "Delete credentials",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "activate-credentials",
          label: "Activate credentials",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "deactivate-credentials",
          label: "Deactivate credentials",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "rotate-credentials-password",
          label: "Rotate or set a password",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "send-credentials-email-verification",
          label: "Send a verification email",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
