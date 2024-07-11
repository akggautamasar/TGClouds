"use client";

import { Error } from "@/components/error";
import React from "react";

function ErrorPage(props: { error: { message: string } }) {
  return <Error />;
}

export default ErrorPage;
