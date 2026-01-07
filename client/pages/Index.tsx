import React, { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { DraggableWindow } from "@/components/ui/draggable-window";
import { DesktopIcon } from "@/components/ui/desktop-icon";
import {
  WorksIcon,
  ContactIcon,
  ArticlesIcon,
  AboutIcon,
  PlaylistIcon,
  RecyclingIcon,
  ProductDesignIcon,
  ContentCreationIcon,
} from "@/components/ui/folder-icons";

interface MediumArticle {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

interface RSSResponse {
  status: string;
  feed: {
    title: string;
    description: string;
  };
  items: MediumArticle[];
}

// Corteve AgriScience Portfolio Images
const corteveImages = [
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F9af9b45f96aa4869a2e8e875d061deaa?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F95fba40e31424a45a75611ec393a6514?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2Faf3c0de0dfca4715aa3c54f6702a265e?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F0b627aa311454b7e9067f05efc1c01e8?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F12956127ea504d92bb982c818b41a4c6?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F8d16c74556204c2cbd59f0ba2393d20b?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2Fcc6c4ae293394d00a21114a5e25d8ca5?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F48a1009bb381459298c8fc735c9b93a0?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2Fa492a3529e45430694c785852e7ba46b?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F47a1e62813eb412d9186d593580682da?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F4c630853a5a941858273bfaca101499a?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F4b257b0d2cd74693899a7714dbc42304?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F48a6fbfb1df44fc18a7d8905f8d94476?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F0f8de02bef394bfda2dad622a0d256b4?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F8ee1caff99d04961be277c6b17765b11?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F292412dfcf4e43838999c222e2f84c33?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2Fbffcc6db7eb84349b5d232558533035e?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F4e14dd3388ff4f5cb728370fd5426176?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F2ba654d9ec1344428eee312f3d63f7be?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2Feefe7f34d7084a8a82b0b0a86ce769f0?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F253dfa31502a4a1db5c78eb1279505b7?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F61aeededc57747bcb318d89fff639503?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2Fa0fff7594ea944b8a27363f81d43e850?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F8d23700fafca4b1db5758ea33a40e58f?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F089371f6f4cd483c96a912aeaff3541c?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F6b7dea78f4c8428dbffd68914c9f45b6?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2Fb27f8a5f3d504aab84634cb8ce680b56?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F6b7dc27da04e475c8bf91c45b102f7e3?format=webp&width=800",
];

// Contact Form Component with EmailJS
function ContactForm() {