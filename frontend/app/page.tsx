"use client";

import Link from "next/link";
import { ArrowRight, CreditCard, Search, Users, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const scaleUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
};

// Define prop types for AnimatedSection
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

// Custom animated section component with proper type definitions
function AnimatedSection({ children, className, id }: AnimatedSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeIn}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <motion.header
        className="border-b"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <CreditCard className="h-6 w-6 text-primary" />
            <Link
                href="/"
                className="text-xl font-bold"
              >
                MoneyTransfer
              </Link>
          </motion.div>
          <nav className="hidden md:flex gap-6">
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link
                href="#features"
                className="text-md font-medium hover:underline underline-offset-4"
              >
                Features
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link
                href="#how-it-works"
                className="text-md font-medium hover:underline underline-offset-4"
              >
                How It Works
              </Link>
            </motion.div>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/signin">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  Sign In
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/signup">
                <Button size="sm" className="cursor-pointer">Sign Up</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="w-full px-4 md:px-6 text-center">
            <motion.div
              className="flex flex-col justify-center space-y-4 max-w-3xl mx-auto text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-2">
                <motion.h1
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Fast & Simple Money Transfers
                </motion.h1>
                <motion.p
                  className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Send money to friends, family, and colleagues with just a few
                  clicks. No complicated processes, just simple transfers.
                </motion.p>
              </div>
              <motion.div
                className="flex flex-col gap-2 min-[400px]:flex-row justify-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/signup">
                    <Button size="lg" className="px-8 cursor-pointer">
                      Get Started
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          repeatDelay: 2,
                          duration: 0.8,
                        }}
                      >
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </motion.div>
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="#how-it-works">
                    <Button variant="outline" size="lg" className="px-8 cursor-pointer">
                      Learn More
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <AnimatedSection
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className=" px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <motion.h2
                  className="text-3xl font-bold tracking-tighter sm:text-5xl"
                  variants={fadeIn}
                >
                  Features That Make Transfers Easy
                </motion.h2>
                <motion.p
                  className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  variants={fadeIn}
                >
                  Everything you need to manage and transfer your money with
                  ease.
                </motion.p>
              </div>
            </div>
            <motion.div
              className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div
                className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 shadow-sm"
                variants={scaleUp}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                }}
              >
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Users className="h-6 w-6 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold">User Directory</h3>
                <p className="text-center text-muted-foreground">
                  Browse all registered users and interact with them directly
                  from your dashboard.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 shadow-sm"
                variants={scaleUp}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                }}
              >
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
                  whileHover={{ rotate: -10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Search className="h-6 w-6 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold">User Search</h3>
                <p className="text-center text-muted-foreground">
                  Quickly find users by name to send them money with just a few
                  clicks.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 shadow-sm"
                variants={scaleUp}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                }}
              >
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <RefreshCw className="h-6 w-6 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold">Instant Transfers</h3>
                <p className="text-center text-muted-foreground">
                  Send money instantly to anyone on the platform with just a few
                  clicks.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </AnimatedSection>

        <AnimatedSection
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32"
        >
          <div className=" px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <motion.h2
                  className="text-3xl font-bold tracking-tighter sm:text-5xl"
                  variants={fadeIn}
                >
                  How It Works
                </motion.h2>
                <motion.p
                  className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  variants={fadeIn}
                >
                  Three simple steps to start sending money to anyone.
                </motion.p>
              </div>
            </div>
            <motion.div
              className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div
                className="flex flex-col items-center space-y-4"
                variants={itemFadeIn}
              >
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  1
                </motion.div>
                <h3 className="text-xl font-bold">Create an Account</h3>
                <p className="text-center text-muted-foreground">
                  Sign up with basic information to create your user profile.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center space-y-4"
                variants={itemFadeIn}
              >
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  2
                </motion.div>
                <h3 className="text-xl font-bold">Find Recipients</h3>
                <p className="text-center text-muted-foreground">
                  Browse or search for users you want to send money to.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center space-y-4"
                variants={itemFadeIn}
              >
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  3
                </motion.div>
                <h3 className="text-xl font-bold">Send Money</h3>
                <p className="text-center text-muted-foreground">
                  Select a user and specify an amount to transfer money
                  instantly.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className=" grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <motion.h2
                className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
                variants={fadeIn}
              >
                Ready to get started?
              </motion.h2>
              <motion.p
                className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                variants={fadeIn}
              >
                Create an account and start sending money to friends and family
                today.
              </motion.p>
            </div>
            <motion.div
              className="mx-auto w-full max-w-sm space-y-2"
              variants={scaleUp}
            >
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link href="/signup">
                    <Button size="lg" className="w-full min-[400px]:w-auto cursor-pointer">
                      Sign Up Now
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </main>
      <motion.footer
        className="border-t py-6 md:py-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className=" flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:py-0">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <CreditCard className="h-5 w-5 text-primary ml-2" />
            <span className="text-lg font-bold">MoneyTransfer</span>
          </motion.div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left pr-2">
            © 2025 MoneyTransfer. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
