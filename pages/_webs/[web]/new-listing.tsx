import { memo, useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { Box, Stack, Heading, Alert, AlertIcon, Text } from '@chakra-ui/react'

import { useCategories } from '@hooks/categories'
import { useCreateListing } from '@hooks/listings'
import { useAppContext } from '@store/hooks'
import { useSelectedWebName } from '@hooks/webs'
import Layout from '@components/layout'
import ListingFormSimplified from '@components/admin/listing-form/ListingFormSimplified'

function Submit() {
  const router = useRouter()
  const { isMobile, selectedWebId } = useAppContext()
  const { categories } = useCategories()
  const selectedWebName = useSelectedWebName()
  const { mutate: createListing } = useCreateListing()

  const goBack = useCallback(() => {
    router.back()
  }, [router])

  const handleSubmit = useCallback(
    (data) => {
      console.log(data)
      data.webId = selectedWebId
      data.pending = true
      data.inactive = false
      data.relations = []
      createListing(data)
      goBack()
    },
    [createListing, goBack, selectedWebId],
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
        <Box maxWidth={isMobile ? '100%' : '700px'}>
          <Heading as="h1" my="1rem">
            Submit new listing
          </Heading>
          <Text>
            You are proposing a new listing for the{' '}
            <strong>{selectedWebName}</strong> web.
          </Text>
          <Box
            my="2rem"
            shadow="base"
            rounded={[null, 'md']}
            overflow={{ sm: 'hidden' }}
          >
            <Alert status="info" colorScheme="blue">
              <AlertIcon />
              Before you submit this form, please ensure that a listing for the
              same entity doesn't already exist, and note that the submission
              will only be approved if it is for a group that has a positive
              contribution to the local community.
            </Alert>
            <Stack bg="white" spacing={6}>
              <ListingFormSimplified
                categories={categories}
                handleSubmit={handleSubmit}
              />
            </Stack>
          </Box>
        </Box>
      </Layout>
    </>
  )
}

export default memo(Submit)

