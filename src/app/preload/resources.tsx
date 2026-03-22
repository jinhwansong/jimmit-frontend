export default function PreloadResources() {
  return (
    <>
      {/* 폰트는 로컬(public/fonts) 사용 - LCP용 기본 폰트 preload */}
      <link
        rel="preload"
        href="/fonts/Pretendard-Regular.otf"
        as="font"
        type="font/otf"
        crossOrigin="anonymous"
      />
      <link
        rel="dns-prefetch"
        href="https://tdpigwjkpkeybdnxxbgr.supabase.co"
      />
      <link rel="dns-prefetch" href="https://image.mux.com" />
      <link
        rel="preload"
        as="image"
        href="/images/main/img_main_banner_pc.avif"
        media="(min-width: 1344px)"
      />
      <link
        rel="preload"
        as="image"
        href="/images/main/img_main_banner_tab.avif"
        media="(min-width: 744px) and (max-width: 1343px)"
      />
      <link
        rel="preload"
        as="image"
        href="/images/main/img_main_banner_mob.avif"
        media="(max-width: 743px)"
      />
    </>
  );
}
