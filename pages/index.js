import Head from 'next/head';
import Header from '@components/Header';
import Footer from '@components/Footer';
import Hero from '@components/Hero';


export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>My Expert | Online Services for Individuals</title>
        <meta name="description" content="Discover our online services for individuals, designed to meet all your needs." />
        <meta name="keywords" content="online services, individuals, assistance, support, expertise" />
        <meta name="author" content="My Expert" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title="Welcome to My Expert!" />
      <main>

        <Hero
          title='Online services to simplify your life'
          description='Discover our solutions tailored to your needs'
          cta='Start for free'
          cta_href='/locations'
        />

        <section className="section">
          <h2 className="sectionTitle">About Us</h2>
          <p className="sectionContent">
            My Expert is a platform dedicated to providing online services for individuals. We are committed to offering solutions tailored to your specific needs.
          </p>
        </section>

        <section className="section">
          <h2 className="sectionTitle">Our Services</h2>
          <p className="sectionContent">
            We offer a wide range of services to help you in various areas:
          </p>
          <ul className="serviceList">
            <li className="serviceItem">Online Consultation</li>
            <li className="serviceItem">Technical Support</li>
            <li className="serviceItem">Administrative Assistance</li>
            <li className="serviceItem">And much more...</li>
          </ul>
        </section>

        <section className="section">
          <h2 className="sectionTitle">Occupations</h2>
          <p className="sectionContent">
            Here is a brief overview of the occupations we cover:
          </p>
          <ul className="occupationList">
            <li className="occupationItem">Software Developer</li>
            <li className="occupationItem">Graphic Designer</li>
            <li className="occupationItem">Project Manager</li>
            <li className="occupationItem">And many more...</li>
          </ul>
          <button className="viewMoreButton" onClick={() => window.location.href='/occupations'}>View More</button>
        </section>

        <section className="section">
          <h2 className="sectionTitle">Locations</h2>
          <p className="sectionContent">
            Here is a brief overview of the locations we serve:
          </p>
          <ul className="locationList">
            <li className="locationItem">New York</li>
            <li className="locationItem">Los Angeles</li>
            <li className="locationItem">Chicago</li>
            <li className="locationItem">And many more...</li>
          </ul>
          <button className="viewMoreButton" onClick={() => window.location.href='/locations'}>View More</button>
        </section>

      </main>
    </div>
  );
}