"use client";
import React, { useRef } from "react";
import { API } from "@/api/api";
import { APIQuery } from "@/api/queryMethod";
import { PageLoading, PageCenter } from "@/components/pageLoading";

function UserAccountLayout({ children }) {
    const loading = useRef(true)
    const services = APIQuery("services", () => API.services());

    if (services.isLoading) {
        return (
            <PageCenter>
                <PageLoading />
            </PageCenter>
        );
    } else if (services.isError) {
        <PageCenter>
            <h2>{services.error?.data?.message} 🪪</h2>
        </PageCenter>
    } else {
        loading.current = false
        return (
            <>
                {children}
            </>
        );
    }
}

export default UserAccountLayout;
