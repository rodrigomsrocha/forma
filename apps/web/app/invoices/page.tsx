import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export default function InvoicesPage() {
  return (
    <div>
      <Button asChild>
        <Link href="invoices/new">
          New invoice
        </Link>
      </Button>
    </div>
  )
}
