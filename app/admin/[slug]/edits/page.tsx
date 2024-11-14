'use client'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import NextLink from 'next/link'
import {
  Box,
  Stack,
  Button,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Link,
  Text,
} from '@chakra-ui/react'
import { HiArrowLeft } from 'react-icons/hi'
import useCategories from '@hooks/categories/useCategories'
import useListing from '@hooks/listings/useListing'
import useUpdateListing from '@hooks/listings/useUpdateListing'
import useListingEdits from '@hooks/listings/useListingEdits'
import { useAppContext } from '@store/hooks'

export default function ListingEditsPage({ params }) {
  const router = useRouter()
  const slug = params.slug
  const { categories } = useCategories()
  const { mutate: updateListing } = useUpdateListing()
  const { selectedWebSlug } = useAppContext()

  const goBack = useCallback(() => {
    router.back()
  }, [router])

  const handleSubmit = useCallback(
    (data) => {
      if (data.id) {
        updateListing(data)
      }
      goBack()
    },
    [updateListing, goBack],
  )

  const { listing, isPending: isLoadingListing } = useListing(slug)
  const { listingEdits, isPending: isLoadingListingEdits } =
    useListingEdits(slug)

  if (!categories || !listing || isLoadingListing || isLoadingListingEdits) {
    return (
      <Center height="50vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  console.log(listingEdits)

  return (
    <Box
      px={{
        base: '4',
        md: '10',
      }}
      py={4}
      maxWidth="3xl"
      mx="auto"
    >
      <Button
        leftIcon={<HiArrowLeft />}
        name="Back"
        mb={2}
        ml={2}
        onClick={goBack}
        variant="link"
        color="gray.700"
      >
        Back
      </Button>

      <Box mt={4}>
        <Text mb="1rem" fontSize="0.875rem">
          You can view this listing at{' '}
          <Link
            as={NextLink}
            href={`https://${selectedWebSlug}.resilienceweb.org.uk/${slug}`}
            target="_blank"
          >
            {selectedWebSlug}.resilienceweb.org.uk/{slug}
          </Link>
        </Text>
        <Box shadow="base" rounded={[null, 'md']} overflow={{ sm: 'hidden' }}>
          {listing.pending && (
            <Alert status="info" colorScheme="purple">
              <AlertIcon />
              This listing was submitted externally and is currently in pending
              state. Check through the information below, and if everything
              looks okay click Approve.
            </Alert>
          )}
          <Stack bg="white" spacing={6}>
            {/* <ListingForm
              categories={categories}
              listing={listing}
              handleSubmit={handleSubmit}
            /> */}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
