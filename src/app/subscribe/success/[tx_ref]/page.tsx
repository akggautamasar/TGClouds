import { subscribeToPro } from "@/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SVGProps } from "react";

export default async function Component({
  params: { tx_ref },
}: {
  params: { tx_ref: string };
}) {
  const result = await subscribeToPro({ tx_ref });

  if (result?.isDone) {
    const data = result.data;
    const formattedAmount = `${data?.currency} ${data?.amount}`;
    const planType = data?.plan === "ANNUAL" ? "Annual" : "Monthly";
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-primary text-primary-foreground">
        <div className="max-w-md w-full p-6 bg-primary rounded-lg shadow-lg">
          <div className="flex flex-col items-center justify-center space-y-6">
            <CircleCheckIcon className="w-16 h-16 fill-primary-foreground" />
            <div className="text-3xl font-bold">Payment Successful</div>
            <p className="text-lg text-center">
              Thank you for your purchase! Your {planType} plan is now active.
            </p>
            <p className="text-lg text-center">
              Amount Paid: <span className="font-bold">{formattedAmount}</span>
            </p>
            <Button variant="secondary" className="w-full">
              <Link href="/files">Continue to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return <PaymentError />;
}

function CircleCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function PaymentError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary text-primary-foreground">
      <div className="max-w-md w-full p-6 bg-primary rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center space-y-6">
          <TriangleAlertIcon className="w-16 h-16 fill-red-500" />
          <div className="text-3xl font-bold">Oops, something went wrong!</div>
          <p className="text-lg text-center">
            There was an error processing your payment. Please contact our
            customer support for assistance.
          </p>
          <Button variant="secondary" className="w-full">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}

function TriangleAlertIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
