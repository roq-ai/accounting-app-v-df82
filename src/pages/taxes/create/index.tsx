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
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createTax } from 'apiSdk/taxes';
import { taxValidationSchema } from 'validationSchema/taxes';
import { TenantInterface } from 'interfaces/tenant';
import { getTenants } from 'apiSdk/tenants';
import { TaxInterface } from 'interfaces/tax';

function TaxCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: TaxInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createTax(values);
      resetForm();
      router.push('/taxes');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<TaxInterface>({
    initialValues: {
      tax_type: '',
      tax_rate: 0,
      tenant_id: (router.query.tenant_id as string) ?? null,
    },
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
              label: 'Create Tax',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Tax
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
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
    operation: AccessOperationEnum.CREATE,
  }),
)(TaxCreatePage);
