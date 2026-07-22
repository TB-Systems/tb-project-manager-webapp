import { Customer, CustomerFormValue, CustomerList } from '../domain/customer.model';
import { CustomerDto, CustomerListResponseDto, CustomerRequestDto } from './customer.dto';

export function mapCustomerDto(dto: CustomerDto): Customer {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    document: dto.document,
    documentType: dto.document_type,
    email: dto.email,
    phone: dto.phone,
    status: dto.status,
    url: dto.url,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapCustomerListDto(dto: CustomerListResponseDto): CustomerList {
  return {
    customers: dto.items.map(mapCustomerDto),
    page: dto.page,
    pageCount: dto.page_count,
  };
}

export function mapCustomerFormToRequest(value: CustomerFormValue): CustomerRequestDto {
  return {
    name: value.name,
    slug: value.slug,
    document: value.document,
    document_type: value.documentType,
    email: value.email,
    phone: value.phone,
    status: value.status,
    url: value.url,
  };
}
