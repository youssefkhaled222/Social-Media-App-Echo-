import React from "react";
import { Divider } from "@heroui/react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-white/10 bg-slate-950 text-white">
      <div className="w-[94%] md:w-[88%] xl:w-[80%] mx-auto py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-extrabold tracking-wide">ECHO</h2>
            <p className="mt-2 max-w-md text-sm text-slate-400 leading-6">
              Share your thoughts, connect with people, and keep your vibe alive.
            </p>
          </div>

          <div className="flex items-center justify-center gap-5 text-2xl">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-slate-800 p-3 transition duration-200 hover:-translate-y-1 hover:bg-slate-700 hover:text-slate-200"
            >
              <FaGithub />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-slate-800 p-3 transition duration-200 hover:-translate-y-1 hover:bg-slate-700 hover:text-slate-200"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-slate-800 p-3 transition duration-200 hover:-translate-y-1 hover:bg-slate-700 hover:text-slate-200"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        <Divider className="my-7 bg-slate-800" />

        <div className="text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Echo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}