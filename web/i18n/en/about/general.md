<script lang="ts">
    import { t } from "$lib/i18n/translations";
    import { partners, contacts, docs } from "$lib/env";

    import SectionHeading from "$components/misc/SectionHeading.svelte";
</script>

<section id="summary">
<SectionHeading
    title={$t("about.heading.summary")}
    sectionId="summary"
/>

decimator helps you save anything from your favorite websites: video, audio, photos or gifs. just paste the link and you're ready to rock!

no ads, trackers, paywalls, or other nonsense. just a convenient web app that works anywhere, whenever you need it.
</section>

<section id="motivation">
<SectionHeading
    title={$t("about.heading.motivation")}
    sectionId="motivation"
/>

decimator was created for public benefit, to protect people from ads and malware pushed by its alternatives.
we believe that the best software is safe, open, and accessible.

a part of our infrastructure is provided by our long-standing partner, [royalehosting.net]({partners.royalehosting})!
</section>

<section id="privacy">
<SectionHeading
    title={$t("about.heading.privacy")}
    sectionId="privacy"
/>

all requests to the backend are anonymous and all information about tunnels is encrypted.
we have a strict zero log policy and don't track *anything* about individual people.

when a request needs additional processing, decimator processes files on-the-fly.
it's done by tunneling processed parts directly to the client, without ever saving anything to disk.
for example, this method is used when the source service provides video and audio channels as separate files.

additionally, you can [enable forced tunneling](/settings/privacy#tunnel) to protect your privacy.
when enabled, decimator will tunnel all downloaded files.
no one will know where you download something from, even your network provider.
all they'll see is that you're using a decimator instance.
</section>

<section id="community">
<SectionHeading
    title={$t("about.heading.community")}
    sectionId="community"
/>

decimator is used by countless artists, educators, and content creators to do what they love.
we're always on the line with our community and work together to make decimator even more useful.
feel free to [join the conversation](/about/community)!

we believe that the future of the internet is open, which is why decimator is
[source first](https://sourcefirst.com/) and [easily self-hostable]({docs.instanceHosting}).

if your friend hosts a processing instance, just ask them for a domain and [add it in instance settings](/settings/instances#community).

you can check the source code and contribute [on github]({contacts.github}) at any time.
we welcome all contributions and suggestions!
</section>

<section id="local">
<SectionHeading
    title={$t("about.heading.local")}
    sectionId="local"
/>

newest features, such as [remuxing](/remux), work locally on your device.
on-device processing is efficient and never sends anything over the internet.
it perfectly aligns with our future goal of moving as much processing as possible to the client.
</section>
