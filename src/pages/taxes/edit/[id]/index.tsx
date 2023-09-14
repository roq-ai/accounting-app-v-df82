import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getTaxById, updateTaxById } from 'apiSdk/taxes';
import { taxValidationSchema } from 'validationSchema/taxes';
import { TaxInterface } from 'interfaces/tax';
import { TenantInterface } from 'interfaces/tenant';
import { getTenants } from 'apiSdk/tenants';

function TaxEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<TaxInterface>(
    () => (id ? `/taxes/${id}` : null),
    () => getTaxById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: TaxInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateTaxById(id, values);
      mutate(updated);
      resetForm();
      router.push('/taxes');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<TaxInterface>({
    initialValues: data,
    validationSchema: taxValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Taxes',
              link: '/taxes',
            },
            {
              label: 'Update Tax',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Tax
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.tax_type}
            label={'Tax Type'}
            props={{
              name: 'tax_type',
              placeholder: 'Tax Type',
              value: formik.values?.tax_type,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Tax Rate"
            formControlProps={{
              id: 'tax_rate',
              isInvalid: !!formik.errors?.tax_rate,
            }}
            name="tax_rate"
            error={formik.errors?.tax_rate}
            value={formik.values?.tax_rate}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('tax_rate', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<TenantInterface>
            formik={formik}
            name={'tenant_id'}
            label={'Select Tenant'}
            placeholder={'Select Tenant'}
            fetcher={getTenants}
            labelField={'name'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/taxes')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'tax',
    operation: AccessOperationEnum.UPDATE,
  }),
)(TaxEditPage);
