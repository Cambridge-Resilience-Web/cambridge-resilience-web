import { memo, useCallback, useState } from 'react'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Box,
  Stack,
  Heading,
  Alert,
  AlertIcon,
  Text,
  Button,
} from '@chakra-ui/react'

import { useCategories } from '@hooks/categories'
import { useCreateListing } from '@hooks/listings'
import { useAppContext } from '@store/hooks'
import { useWeb } from '@hooks/webs'
import Layout from '@components/layout'
import ListingFormSimplified from '@components/admin/listing-form/ListingFormSimplified'
import { PROTOCOL, REMOTE_HOSTNAME } from '@helpers/config'

function Submit() {
  const router = useRouter()
  const { selectedWebSlug } = useAppContext()
  const { categories } = useCategories()
  const { mutate: createListing } = useCreateListing()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { web } = useWeb({ webSlug: selectedWebSlug })

  const handleSubmit = useCallback(
    (data) => {
      data.webId = web.id
      data.pending = true
      data.inactive = false
      data.relations = []
      createListing(data)
      setTimeout(() => {
        setIsSubmitted(true)
        if (window) {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 1000)
    },
    [createListing, web.id],
  )

  if (router.isFallback || !categories) {
    return (
      <Layout>
        <h1>Please wait…</h1>
      </Layout>
    )
  }

  return (
    <>
      <NextSeo
        title={`New Listing | Resilience Web`}
        openGraph={{
          title: `New Listing | Resilience Web`,
        }}
      />
      <Layout>
        <Box maxWidth={{ base: '100%', md: '700px' }}>
          {isSubmitted ? (
            <>
              <Heading as="h1" my="1rem">
                Thank you!
              </Heading>
              <Text>
                You have submitted your new proposed listing succesfully 🎉{' '}
                <br /> Thank you for your contribution. It will next be checked
                and hopefully approved by the admins of the{' '}
                <strong>{web.title}</strong> web.
              </Text>
              <Link
                href={`${PROTOCOL}://${selectedWebSlug}.${REMOTE_HOSTNAME}`}
              >
                <Button mt="2rem" size="md" variant="rw">
                  Go back to {web.title} Resilience Web
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Heading as="h1" my="1rem">
                Propose new listing
              </Heading>
              <Text>
                You are proposing a new listing for the{' '}
                <strong>{web.title}</strong> web.
              </Text>
              <Box
                my="2rem"
                shadow="base"
                rounded={[null, 'md']}
                overflow={{ sm: 'hidden' }}
              >
                <Alert status="info" colorScheme="blue">
                  <AlertIcon />
                  Before you submit this form, please ensure that a listing for
                  the same entity doesn't already exist, and note that the
                  submission will only be approved if it is for a group that has
                  a positive contribution to the local community.
                </Alert>
                <Stack bg="white" spacing={6}>
                  <ListingFormSimplified
                    categories={categories}
                    handleSubmit={handleSubmit}
                  />
                </Stack>
              </Box>
            </>
          )}
        </Box>
      </Layout>
    </>
  )
}

export default memo(Submit)
