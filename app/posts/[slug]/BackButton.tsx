"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const [href, setHref] = useState("/");

  useEffect(() => {
    if (document.referrer.includes("/blog")) {
      setHref("/blog");
    }
  }, []);

  return (
    <Button asChild variant="outline" className="mb-6">
      <Link href={href}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Link>
    </Button>
  );
}
