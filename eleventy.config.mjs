import { nhsukEleventyPlugin } from '@x-govuk/nhsuk-eleventy-plugin'
import yaml from 'js-yaml'

const serviceName = 'Digital prevention services (DPSP)'

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(nhsukEleventyPlugin, {
    titleSuffix: `NHS ${serviceName}`,
    stylesheets: ['/assets/application.css'],
    markdown: {
      headingsStartWith: 'l'
    },
    header: {
      service: {
        text: serviceName,
        href: '/'
      },
      navigation: {
        items: [
          {
            text: 'Home',
            href: '/'
          },
          {
            text: 'Screening',
            href: '/screening'
          },
          {
            text: 'Vaccinations',
            href: '/vaccinations'
          },
          {
            text: 'Roadmap',
            href: '/roadmap'
          },
          {
            text: 'Case studies',
            href: '/case-studies'
          },
          {
            text: 'Notes',
            href: '/notes'
          },
          {
            text: 'Documents',
            href: '/docs'
          }
        ]
      }
    },
    footer: {
      meta: {
        items: [
          {
            text: 'About us',
            href: '/about'
          },
          {
            text: 'Privacy policy',
            href: '/privacy-policy'
          }
        ]
      }
    }
  })

  // The NHS plugin does not provide a way to add a script to the <head>, so use this approach instead
  eleventyConfig.addTransform('analytics-script', (content) => {
    if (!content.includes('<head>')) return content

    return content.replace(
      '<head>',
      // Loaded with a Subresource Integrity check, so the browser refuses to run it if the NHSE-hosted CloudFront ever serves different contents.
      // If this URL ever changes to a version of Umami that makes a breaking change to the snippet, tracking will stop working until this hash is regenerated with:
      // openssl dgst -sha384 -binary script.js | openssl base64 -A
      '<head>\n<script defer src="https://d11vb7m97xecvc.cloudfront.net/script.js" integrity="sha384-FeSgFWhRpNmUWqmtRLZpDSRTuxgovbVqlyM0OaJpq2IanhF2u3xjYziXsyXR9Kg/" crossorigin="anonymous" data-website-id="046780c9-3684-4ded-a9d2-bdf361faf561" data-host-url="https://d11vb7m97xecvc.cloudfront.net" data-domains="www.digital-prevention-services.nhs.uk"></script>'
    )
  })

  // Allow YAML to be used for data
  eleventyConfig.addDataExtension('yaml', (contents) => yaml.load(contents))

  // Passthrough
  eleventyConfig.addPassthroughCopy('./app/assets/images')
  eleventyConfig.addPassthroughCopy('./app/assets/pdfs')

  return {
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'app',
      includes: '_components',
      layouts: '_layouts'
    }
  }
}
