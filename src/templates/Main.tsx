import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useRef } from 'react';

import { AppConfig } from '@/utils/AppConfig';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  const router = useRouter();
  const popup = useRef<HTMLDivElement>(null);
  const bgp = useRef<HTMLDivElement>(null);

  const handleLogin = (e: any) => {
    e.preventDefault();
    popup.current?.classList.remove('hidden');
    bgp.current?.classList.remove('hidden');
    popup.current?.classList.add('flex');
    bgp.current?.classList.add('flex');
    bgp.current?.focus();
  };

  const handleClosePopup = () => {
    bgp.current?.classList.add('hidden');
    popup.current?.classList.add('hidden');
    popup.current?.classList.remove('flex');
    bgp.current?.classList.remove('flex');
  };

  const onKeyPressed = (e: any) => {
    if (e.keyCode === 27) {
      handleClosePopup();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-200 text-gray-700 antialiased">
      {props.meta}

      <div
        ref={bgp}
        onKeyDown={onKeyPressed}
        tabIndex={0}
        className="absolute hidden h-screen w-screen items-center justify-center"
      >
        <div
          onClick={handleClosePopup}
          className="absolute z-10 h-screen w-screen bg-gray-500/50"
        ></div>
        <div
          ref={popup}
          className="absolute z-10 hidden items-center text-center font-mono text-white"
        >
          <div className="m-auto flex w-96 flex-col rounded-lg bg-white px-12 pt-8 pb-10 opacity-100">
            <p className="mb-10 text-xl font-semibold text-slate-700">
              Sign In/ Sign Up
            </p>
            <button className="rounded-md bg-red-400 py-2 font-semibold">
              Sign In with Google
            </button>
            <button className="my-3 rounded-md bg-blue-400 py-2 font-semibold">
              Sign In with Facebook
            </button>
            <button className="rounded-md bg-slate-600 py-2 font-semibold">
              Sign In with Zalo
            </button>
          </div>
        </div>
      </div>

      <header className="bg-gray-400 py-2">
        <section className="mx-auto flex max-w-screen-lg items-center gap-5">
          <div className="w-56">
            <Link href="/" className="no-underline">
              <a className="z-0 flex items-center border-none">
                <Image
                  src={`${router.basePath}/assets/images/logo-starter.jpeg`}
                  alt="logo starter"
                  height={40}
                  width={90}
                />
              </a>
            </Link>
          </div>
          <div className="w-80">
            <input
              className="w-full rounded border border-slate-400 py-1 px-3 placeholder:text-slate-400 focus:outline-none"
              placeholder="Nhập nội dung cần tìm kiếm"
            />
          </div>
          <div className="grow">
            <div className="flex justify-between border-none font-semibold text-gray-800">
              <div className="uppercase">
                <ul className="flex gap-3 font-semibold">
                  <li>
                    <Link href={'/mp3/'}>
                      <a className="border-none text-gray-800">mp3</a>
                    </Link>
                  </li>
                  <li>
                    <Link href={'/news/'}>
                      <a className="border-none text-gray-800">news</a>
                    </Link>
                  </li>
                  <li>
                    <Link href={'/tv/'}>
                      <a className="border-none text-gray-800">tv</a>
                    </Link>
                  </li>
                  <li>
                    <Link href={'/video/'}>
                      <a className="border-none text-gray-800">video</a>
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <Link href={'/login'}>
                  <a className={'py-2'} onClick={handleLogin}>
                    Login
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </header>

      <div className="mx-auto max-w-screen-lg bg-white">
        <div className="content py-5 text-base">{props.children}</div>

        <div className="border-t border-gray-300 py-4 text-center text-sm">
          © Copyright {new Date().getFullYear()} {AppConfig.title}. Powered with{' '}
          <span role="img" aria-label="Love">
            ♥
          </span>{' '}
          by{' '}
          <a href="https://github.com/VuAnhQuan-alh/starter-boilerplate">
            Create UI by Quan Va
          </a>
        </div>
      </div>
    </div>
  );
};

export { Main };
