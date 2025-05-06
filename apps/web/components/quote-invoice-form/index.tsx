"use client";

import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Switch } from "@workspace/ui/components/switch";
import { cn } from "@workspace/ui/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function QuoteInvoiceForm() {
  const form = useForm();
  const [step, setStep] = useState(0);
  const totalSteps = 4;

  const previousFormStep = () => {
    if (step > 0) {
      setStep((currentStep) => currentStep - 1);
    }
  };

  const onSubmit = (values: unknown) => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      console.log(values);
      setStep(0);
      form.reset();
    }
  };

  return (
    <div className="p-8">
      {step === 0 && (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Client & Document</h1>
          <Form {...form}>
            <form
              className="grid lg:grid-cols-2 gap-4 grid-cols-1"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Client Details</CardTitle>
                  <CardDescription>
                    Who is this invoice/quote for?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jhon Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Client Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="jhon@doe.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Address</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Contact</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <FormField
                    control={form.control}
                    name="save_client"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Save this client</FormLabel>
                          <FormDescription>
                            Auto-fill details for future use
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Document Setup</CardTitle>
                  <CardDescription>
                    Configure your document type and numbering.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="doc_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Document Type</FormLabel>
                          <Select onValueChange={field.onChange} value="quote">
                            <FormControl>
                              <SelectTrigger disabled className="w-full max-w-[200px]">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="quote">Quote</SelectItem>
                              <SelectItem value="invoice">Invoice</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="doc_number"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Document Number</FormLabel>
                          <FormControl>
                            <Input placeholder="QUO-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="issue_date"
                    defaultValue={new Date()}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Issue date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>{format(new Date(), "PPP")}</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || new Date()}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select the desire currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="usd">USD</SelectItem>
                            <SelectItem value="eur">EUR</SelectItem>
                            <SelectItem value="brl">BRL</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <div className="col-span-full place-self-end gap-2 flex items-center mt-auto">
                <Button onClick={previousFormStep} disabled type="button">
                  <ChevronLeft />
                  Back
                </Button>
                <Button type="submit">
                  Next
                  <ChevronRight />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
      {step === 1 && (
        <div>
          <h1>Items/Service</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="col-span-full place-self-end gap-2 flex items-center">
                <Button onClick={previousFormStep} type="button">
                  <ChevronLeft />
                  Back
                </Button>
                <Button type="submit">
                  Next
                  <ChevronRight />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h1>Terms and Payment</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="col-span-full place-self-end gap-2 flex items-center">
                <Button onClick={previousFormStep} type="button">
                  <ChevronLeft />
                  Back
                </Button>
                <Button type="submit">
                  Next
                  <ChevronRight />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
      {step === 3 && (
        <div>
          <h1>Finish</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="col-span-full place-self-end gap-2 flex items-center">
                <Button onClick={previousFormStep} type="button">
                  <ChevronLeft />
                  Back
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
