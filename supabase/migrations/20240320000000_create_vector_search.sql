-- Enable the pgvector extension
create extension if not exists vector;

-- Create the product_embeddings table
create table if not exists product_embeddings (
  id text primary key,
  product_id text not null,
  category_id text not null,
  embedding vector(768) not null,
  metadata jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for vector similarity search
create index if not exists product_embeddings_embedding_idx on product_embeddings 
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Create function for vector similarity search
create or replace function match_products(
  query_embedding vector(768),
  category_id text,
  match_threshold float,
  match_count int
)
returns table (
  product_id text,
  category_id text,
  similarity float,
  metadata jsonb
)
language plpgsql
as $$
begin
  return query
  select
    product_embeddings.product_id,
    product_embeddings.category_id,
    1 - (product_embeddings.embedding <=> query_embedding) as similarity,
    product_embeddings.metadata
  from product_embeddings
  where product_embeddings.category_id = match_products.category_id
  and 1 - (product_embeddings.embedding <=> query_embedding) > match_threshold
  order by product_embeddings.embedding <=> query_embedding
  limit match_count;
end;
$$; 