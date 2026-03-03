import { useAuth } from "#/hooks/useAuth";
import LoginPage from "#/pages/LoginPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
    component: LoginPage,
})