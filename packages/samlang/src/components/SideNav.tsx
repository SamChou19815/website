import React from 'react';

export default function SideNav(): JSX.Element {
  return (
    <div className="hidden lg:flex flex-col sticky z-20 top-0 bg-white h-screen w-64 mx-4 my-0 px-0 py-8 border-l border-r border-solid border-gray-300">
      <div className="mx-auto my-0">
        <div className="mx-0 my-4 border-b border-solid border-gray-300">
          <a className="mx-0 my-4 flex items-center" href="/#">
            <img className="h-8 mr-2" src="/img/logo.png" alt="Logo" />
            <strong>samlang</strong>
          </a>
          <a className="mx-0 my-4 block" href="/demo">
            Demo
          </a>
          <a
            className="mx-0 my-4 block"
            href="https://github.com/SamChou19815/samlang"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
        <div>
          <a className="mx-0 my-4 block" href="#introduction">
            Introduction
          </a>
          <a className="mx-0 my-4 block" href="#getting-started">
            Getting Started
          </a>
          <a className="mx-0 my-4 block" href="#program-layout">
            Program Layout
          </a>
          <a className="mx-0 my-4 block" href="#classes-types">
            Classes and Types
          </a>
          <a className="mx-0 my-4 block" href="#expressions">
            Expressions
          </a>
          <a className="mx-0 my-4 block" href="#type-inference">
            Type Inference
          </a>
        </div>
      </div>
    </div>
  );
}
