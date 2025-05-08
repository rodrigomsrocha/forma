"use client";

import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@workspace/ui/components/table";
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
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { formatCurrency } from "@/utils/format-currnency";
import { Textarea } from "@workspace/ui/components/textarea";

type FormValues = {
  // Step 0 fields
  name: string;
  email: string;
  address: string;
  contact: string;
  save_client: boolean;
  doc_type: string;
  doc_number: string;
  issue_date: Date;
  currency: string;

  // Step 1 fields
  items: {
    description: string;
    quantity: number;
    unitValue: number;
    total: number;
  }[];

  // Step 2 fields
  payment_methods: string[];
  deposit: boolean;
  deposit_value: number;
  bank_details: string;
  payment_terms: string[];
};

const payments = [
  {
    id: "stripe",
    label: "Stripe",
  },
  {
    id: "bank_transfer",
    label: "Bank Transfer",
  },
  {
    id: "paypal",
    label: "PayPal",
  },
] as const;

export function QuoteInvoiceForm() {
  const form = useForm<FormValues>({
    defaultValues: {
      items: [{ description: "", quantity: 1, unitValue: 0, total: 0 }],
      payment_methods: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  const [step, setStep] = useState(0);
  const totalSteps = 4;

  const [totalAmount, setTotalAmount] = useState(0);

  const handleRemoveItem = (index: number) => {
    remove(index);
    updateTotalAmount();
  };

  const updateTotalAmount = () => {
    const items = form.watch("items");
    const sum = items.reduce((acc, item) => acc + (item.total || 0), 0);
    setTotalAmount(sum);
  };

  const calculateTotal = (index: number) => {
    const quantity =
      parseFloat(String(form.watch(`items.${index}.quantity`))) || 0;
    const unitValue =
      parseFloat(String(form.watch(`items.${index}.unitValue`))) || 0;
    const total = quantity * unitValue;
    form.setValue(`items.${index}.total`, total);
    updateTotalAmount();
  };

  const previousFormStep = () => {
    if (step > 0) {
      setStep((currentStep) => currentStep - 1);
    }
  };

  const onSubmit = (values: FormValues) => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
      console.log(values);
    } else {
      console.log(values);
      setStep(0);
      form.reset();
    }
  };

  return (
    <div className="p-8">
      {step === 0 && (
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Client & Document</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Set up the foundation of your document. Who is it for, and how
            should it be structured?
          </p>
          <Form {...form}>
            <form
              className="grid lg:grid-cols-2 gap-4 grid-cols-1"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Client Details</CardTitle>
                  <CardDescription>Who is this for?</CardDescription>
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
                  <CardDescription>Configure your template.</CardDescription>
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
                              <SelectTrigger
                                disabled
                                className="w-full max-w-[200px]"
                              >
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
                <Button
                  variant="outline"
                  onClick={previousFormStep}
                  disabled
                  type="button"
                >
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
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Items/Service</h1>
          <p className="text-sm text-muted-foreground mb-8">
            What are you charging for?
          </p>
          <Button
            type="button"
            onClick={() =>
              append({
                description: "",
                quantity: 1,
                unitValue: 0,
                total: 0,
              })
            }
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-2/5">Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Value</TableHead>
                      <TableHead className="w-[200px]">Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Description" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      calculateTotal(index);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.unitValue`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      calculateTotal(index);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          {formatCurrency(
                            form.watch(`items.${index}.total`),
                            form.watch("currency")
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleRemoveItem(index)}
                            variant="destructive"
                            size="icon"
                            type="button"
                          >
                            <Trash2 />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>Total</TableCell>
                      <TableCell className="w-[200px] font-bold">
                        {formatCurrency(totalAmount, form.watch("currency"))}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
              <div className="flex gap-2 place-self-end items-center mt-auto">
                <Button
                  type="button"
                  onClick={previousFormStep}
                  variant="outline"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="submit">
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Terms and Payment</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Finalize payment methods and set expectations.
          </p>
          <Form {...form}>
            <form
              className="grid lg:grid-cols-2 gap-4 grid-cols-1"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Payment Terms</CardTitle>
                  <CardDescription>
                    How should the client pay you?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="items"
                    render={() => (
                      <FormItem>
                        <FormLabel>Paymeny Methods</FormLabel>
                        {payments.map((payment) => (
                          <FormField
                            key={payment.id}
                            control={form.control}
                            name="payment_methods"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={payment.id}
                                  className="flex flex-row items-start space-x-2 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(
                                        payment.id
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              payment.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== payment.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {payment.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={
                      !form.watch("payment_methods").includes("bank_transfer")
                    }
                    control={form.control}
                    name="bank_details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Bank Name, Account Number, etc."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter >
                  <div className="flex gap-4 w-full">
                    <FormField
                      control={form.control}
                      name="deposit"
                      render={({ field }) => (
                        <FormItem className="flex-1 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Deposit required?</FormLabel>
                            <FormDescription>
                              Require a deposit before starting the project
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
                    <FormField
                      disabled={!form.watch("deposit")}
                      control={form.control}
                      name="deposit_value"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Deposit Value</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="50%" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Terms & Notes</CardTitle>
                  <CardDescription>Add context or legal terms.</CardDescription>
                </CardHeader>
                <CardContent></CardContent>
                <CardFooter></CardFooter>
              </Card>
              <div className="col-span-full place-self-end gap-2 flex items-center">
                <Button
                  variant="outline"
                  onClick={previousFormStep}
                  type="button"
                >
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
                <Button
                  variant="outline"
                  onClick={previousFormStep}
                  type="button"
                >
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
