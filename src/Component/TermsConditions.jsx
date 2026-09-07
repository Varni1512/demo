import React from "react";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero / Header */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Terms & Conditions of Use
          </h1>

          <p className="mt-4 text-gray-300">
            Swadesh Vaani News Network
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <article className="prose prose-lg max-w-none">

          {/* Introduction */}
          <p>
            This Terms of Use (the “Terms”) provided below is with respect to
            the access and use of the <strong>Swadesh Vaani News Network</strong>{" "}
            website (the “Site”) which may be accessed via, but not restricted
            to, the World Wide Web, PDA, mobile phone, digital television, and
            RSS feeds.
          </p>

          <p>
            These terms and conditions apply whenever you access the site, on
            whatever devices. This Agreement is for an indefinite term, and
            you understand and agree that you are bound by such terms till the
            time you access this site.
          </p>

          {/* Binding Agreement */}
          <section>
            <h2>Binding Agreement</h2>

            <p>
              By using the Site, you agree to be legally bound by these terms,
              which shall take effect immediately on your first use of the Site.
              If you do not agree to be legally bound by all the following
              terms please do not access and/or use the Site.
            </p>

            <p>
              By using the Site as a reader, you are deemed to have accepted
              these terms and conditions. We also advise you to read carefully
              the Privacy Policy.
            </p>
          </section>

          {/* Copyright */}
          <section>
            <h2>Copyright and Trademarks</h2>

            <p>
              Unless otherwise stated, copyright and all intellectual property
              rights in all material presented on the site (including but not
              limited to text, audio, video or graphical images), trademarks
              and logos appearing on the Site are the property of{" "}
              <strong>Swadesh Vaani News Network</strong> and are protected
              under applicable Indian laws.
            </p>

            <p>
              Any infringement shall be vigorously defended and pursued to the
              fullest extent permitted by law.
            </p>
          </section>

          {/* Access and Use */}
          <section>
            <h2>Access and Use</h2>

            <p>
              Access to and use of the site is provided by{" "}
              <strong>Swadesh Vaani News Network</strong>.
            </p>

            <p>
              <strong>(i)</strong> It may change these terms at any time by
              posting changes online. Please review these terms regularly to
              ensure you are aware of any changes made by Swadesh Vaani News
              Network. Your continued use of the Site after changes to this
              policy are posted means you agree to be legally bound by these
              terms as updated and/or amended.
            </p>

            <p>
              <strong>(ii)</strong> You may not copy, reproduce, republish,
              download, post, broadcast, transmit, make available to the
              public, or otherwise use content on the Site in any way except
              for your own personal, non-commercial use.
            </p>

            <p>
              You also agree not to adapt, alter or create a derivative work
              from any content on the Site except for your own personal,
              non-commercial use.
            </p>

            <p>
              Any other use of the Site content requires the prior written
              permission of <strong>Swadesh Vaani News Network</strong>.
            </p>

            <p>
              <strong>(iii)</strong> You agree to use the Site only for lawful
              purposes, and in a way that does not infringe the rights of,
              restrict or inhibit anyone else’s use and enjoyment of the Site.
            </p>

            <p>
              Prohibited behaviour includes harassing or causing distress or
              inconvenience to any person, transmitting obscene or offensive
              content or disrupting the normal flow of dialogue within the
              Site.
            </p>
          </section>

          {/* Disclaimer */}
          <section>
            <h2>Disclaimer of Liability</h2>

            <p>
              <strong>Swadesh Vaani News Network</strong> publishes content
              that is true to the best of our knowledge and information, and
              we accept no responsibility for any statement contained in the
              material.
            </p>

            <p>
              Readers are expected to exercise their own judgement and should
              not rely on anything published on the Site without first taking
              reasonable care to verify its credibility for themselves.
            </p>

            <p>
              Nothing in the material is provided for any specific purpose or
              at the request of any particular person. We give no warranties of
              any kind and make no representations regarding the information,
              names, images, pictures, logos, and icons found on the Site.
            </p>

            <p>
              The Site contains links through which you may access other
              websites; these sites are not under our control, and we are in no
              way responsible for their contents.
            </p>
          </section>

          {/* Content */}
          <section>
            <h2>Content</h2>

            <p>
              The contents of the Site are only for general information or use.
              They do not constitute advice and should not be relied upon in
              making (or refraining from making) any decision.
            </p>

            <p>
              Any specific advice or replies to queries in any part of the Site
              is/are the personal opinion of such experts/consultants/persons
              and are not subscribed to by the Site or{" "}
              <strong>Swadesh Vaani News Network</strong>.
            </p>
          </section>

          {/* General */}
          <section>
            <h2>General</h2>

            <p>
              These terms may vary from time to time. Please ensure that you
              review these terms and conditions regularly as you will be deemed
              to have accepted any variation if you continue to use the site
              after it has been posted.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2>Governing Law</h2>

            <p>
              These terms shall be governed by and interpreted in accordance
              with the laws of India and especially the Information Technology
              Act, 2000.
            </p>

            <p>
              All relevant rules, regulations, directions, orders and
              notifications will also apply.
            </p>

            <p>
              The Courts in <strong>Jharkhand</strong> shall have exclusive
              jurisdiction to the exclusion of other courts.
            </p>
          </section>

        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Swadesh Vaani News Network. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
};

export default TermsConditions;