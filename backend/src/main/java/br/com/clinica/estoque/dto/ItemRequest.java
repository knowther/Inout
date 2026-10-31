package br.com.clinica.estoque.dto;

import jakarta.validation.constraints.NotBlank;

public record ItemRequest(
        @NotBlank(message = "Nome é obrigatório") String nome,
        @NotBlank(message = "Unidade é obrigatória") String unidade) {
}
