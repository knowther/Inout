package br.com.clinica.estoque.dto;

import br.com.clinica.estoque.model.TipoMovimentacao;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record MovimentacaoRequest(
        @NotNull(message = "Item é obrigatório") Long itemId,
        @NotNull(message = "Tipo é obrigatório") TipoMovimentacao tipo,
        @NotNull(message = "Quantidade é obrigatória") @Min(value = 1, message = "Quantidade deve ser maior que zero") Integer quantidade,
        String observacao) {
}
