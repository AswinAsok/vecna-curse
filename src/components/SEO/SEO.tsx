import { Helmet } from "react-helmet";
import { useEventDataContext } from "../../contexts/eventDataContext";

const SEO = () => {
    const eventData = useEventDataContext();

    // Clean description by removing HTML tags
    const cleanDescription = eventData.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

    // Get current URL
    const currentUrl = window.location.href;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{eventData.title}</title>
            <meta name="title" content={eventData.title} />
            <meta name="description" content={cleanDescription} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={eventData.title} />
            <meta property="og:description" content={cleanDescription} />
            <meta property="og:image" content={eventData.banner} />
            <meta property="og:site_name" content="TurnUp Events" />
            <meta property="og:locale" content="en_US" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={eventData.title} />
            <meta name="twitter:description" content={cleanDescription} />
            <meta name="twitter:image" content={eventData.banner} />

            {/* Additional SEO Tags */}
            <meta name="keywords" content="Vecna's Curse, Stranger Things, Halloween, Kochi, TurnUp, Casino Durbar Hall, Halloween Party, Halloween Event" />
            <meta name="author" content="TurnUp" />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={currentUrl} />

            {/* Event Schema for Rich Snippets */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Event",
                    name: eventData.title,
                    description: cleanDescription,
                    image: eventData.banner,
                    startDate: eventData.event_start_date,
                    endDate: eventData.event_end_date,
                    location: {
                        "@type": "Place",
                        name: eventData.place,
                        address: {
                            "@type": "PostalAddress",
                            addressLocality: "Kochi",
                            addressCountry: "IN",
                        },
                    },
                    organizer: {
                        "@type": "Organization",
                        name: eventData.hosts[0]?.title || "TurnUp",
                        url: currentUrl,
                    },
                    offers: eventData.tickets.map((ticket) => ({
                        "@type": "Offer",
                        name: ticket.title,
                        price: ticket.price,
                        priceCurrency: "INR",
                        availability: "https://schema.org/InStock",
                        url: currentUrl,
                    })),
                })}
            </script>
        </Helmet>
    );
};

export default SEO;
