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

import { createBankAccount } from 'apiSdk/bank-accounts';
import { bankAccountValidationSchema } from 'validationSchema/bank-accounts';
import { TenantInterface } from 'interfaces/tenant';
import { getTenants } from 'apiSdk/tenants';
import { BankAccountInterface } from 'interfaces/bank-account';

function BankAccountCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: BankAccountInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createBankAccount(values);
      resetForm();
      router.push('/bank-accounts');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<BankAccountInterface>({
    initialValues: {
      bank_name: '',
      account_number: '',
      balance: 0,
      tenant_id: (router.query.tenant_id as string) ?? null,
    },
    validationSchema: bankAccountValidationSchema,
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
              label: 'Bank Accounts',
              link: '/bank-accounts',
            },
            {
              label: 'Create Bank Account',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Bank Account
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.bank_name}
            label={'Bank Name'}
            props={{
              name: 'bank_name',
              placeholder: 'Bank Name',
              value: formik.values?.bank_name,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.account_number}
            label={'Account Number'}
            props={{
              name: 'account_number',
              placeholder: 'Account Number',
              value: formik.values?.account_number,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Balance"
            formControlProps={{
              id: 'balance',
              isInvalid: !!formik.errors?.balance,
            }}
            name="balance"
            error={formik.errors?.balance}
            value={formik.values?.balance}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('balance', Number.isNaN(valueNumber) ? 0 : valueNumber)
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
              onClick={() => router.push('/bank-accounts')}
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
    entity: 'bank_account',
    operation: AccessOperationEnum.CREATE,
  }),
)(BankAccountCreatePage);
