<template>
    <div class="container">
        <div class="columns">
            <div class="column is-4">
                <img src="https://cdn.scotch.io/2842/b7yhhuUPSGO1fEkMHD6P_sticks.jpeg" alt="A bundle of sticks">
            </div>
            <div class="column is-4">
                <div class="field">
                    <label>Nombre completo</label>
                    <div class="control has-icons-left has-icons-right">
                        <input class="input" type="text" placeholder="Nombre y apellido" v-model='name' :class="[nameError ?  'is-danger' : '', 'input']">
                        <span class="icon is-small is-left">
                            <i class="fa fa-user"></i>
                        </span>
                        <span class="help is-danger" v-show="nameError">
                            {{ nameError }}
                        </span>
                    </div>
                </div>
                <div class="field">
                    <label>Correo electrónico</label>
                    <div class="control has-icons-left has-icons-right">
                        <input class="input" type="text" placeholder="Correo electrónico" v-model='email' :class="[emailError ? 'is-danger' : '', 'input']">
                        <span class="icon is-small is-left">
                            <i class="fa fa-envelope"></i>
                        </span>
                        <span class="help is-danger" v-show="nameError">
                            {{ emailError }}
                        </span>
                    </div>
                </div>
                
                <hr id="left-line">

                <div class="field">
                    <label for="card_number">Número de tarjeta</label>
                    <input id="card_number" v-model="card.number" type="text" :class="[cardNumberError ? 'is-danger' : '', 'input']" placeholder="XXXXXXXXXXXXXXXX">
                    <span class="help is-danger" v-show="cardNumberError">
                        {{ cardNumberError }}
                    </span>
                </div>

                <div class="field">
                    <label for="cvc">CVC</label>
                    <input id="cvc" v-model="card.cvc" type="text" :class="[cardCvcError ? 'is-danger' : '', 'input']" placeholder="123">
                    <span class="help is-danger" v-show="cardCvcError">
                        {{ cardCvcError }}
                    </span>
                </div>

                <div class="field">
                    <label for="exp_month">Mes de expiración</label>
                    <input id="exp_month" v-model="card.exp_month" type="text" :class="[cardMonthError ? 'is-danger' : '', 'input']" placeholder="MM">
                    <span class="help is-danger" v-show="cardMonthError">
                        {{ cardMonthError }}
                    </span>
                </div>

                <div class="field">
                    <label for="exp_year">Año de expiración</label>
                    <input id="exp_year" v-model="card.exp_year" type="text" :class="[cardYearError ? 'is-danger' : '', 'input']" placeholder="YY">
                    <span class="help is-danger" v-show="cardYearError">
                        {{ cardYearError }}
                    </span>
                </div>

                <div class="help is-danger" v-if="cardCheckError">
                    <span>{{ cardCheckErrorMessage }}</span>
                </div>
            </div>
            <div class="column is-4">
                <label>Comentarios adicionales</label>
                <textarea class="textarea" placeholder="¿Qué comentarios o indicaciones necesitas que sepamos?" v-model="specialNote"></textarea>

                <hr>

                <div class="field">
                    <label>Domicilio</label>
                    <input type="text" class="input" v-model="address.street" placeholder="Sol 203 int 3">
                </div>
                <div clasS="field">
                    <label>Ciudad</label>
                    <input type="text" class="input" v-model="address.city" placeholder="Zapopan">
                </div>
                <div class="field">
                    <label>Estado</label>
                    <input type="text" class="input" v-model="address.state" placeholder="Jalisco">
                </div>
                <div class="field">
                    <label>Código postal</label>
                    <input type="text" class="input" v-model="address.zip" placeholder="94607">
                </div>
            </div>
        </div>
        <div class="columns">
            <div class="column is-12">
                <button type="submit" class="button is-primary is-large is-pulled-right" @click.prevent="validate" :disabled="cardCheckSending">
                    <span v-if="cardCheckSending">
                        <i class="fa fa-btn fa-spinner fa-spin"></i></i>
                        Ordenando...
                    </span>
                    <span v-else>
                        Confirmar pedido
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>
<style>
h2 { text-decoration: underline; }
.textarea:not([rows]) {max-height: 110px;min-height:110px;}
.container { margin-bottom: 30px; }
.column > img { margin-top: 60px; }
.button-field { display: flex;justify-content: center; }
#left-line { margin-top: 27px; }
</style>
<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                stripeKey: 'pk_test_zVs2ibd5SELaO2TWVZ1qnTyM',
                // fields
                name: null,
                email: null,
                specialNote: null,
                address: {
                    street: null,
                    city: null,
                    state: null,
                    zip: null
                },
                card: {
                    number: '4000056655665556',
                    cvc: null,
                    exp_month: null,
                    exp_year: null,
                },
                // validation
                nameError: null,
                emailError: null,
                cardNumberError: null,
                cardCvcError: null,
                cardMonthError: null,
                cardYearError: null,
                cardCheckSending: false,
                cardCheckError: false,
                cardCheckErrorMessage: ''
            }
        },
        methods: {
            validate() {
                this.clearCardErrors();
                let valid = true;
                if (!this.name) {
                    valid = false;
                    this.nameError = "El nombre es obligatorio";
                }
                if (!this.email) {
                    valid = false;
                    this.emailError = "El email es obligatorio";
                }
                if (!this.card.number) {
                    valid = false;
                    this.cardNumberError = "Nḿero de tarjeta es obligatorio";
                }
                if (!this.card.cvc) {
                    valid = false;
                    this.cardCvcError = "CVC es obligatorio";
                }
                if (!this.card.exp_month) {
                    valid = false;
                    this.cardMonthError = "Mes es obligatorio";
                }
                if (!this.card.exp_year) {
                    valid = false;
                    this.cardYearError = "Año es obligatorio";
                }
                if (valid) {
                    this.createToken();
                }
            },
            clearCardErrors() {
                this.nameError = null;
                this.emailError = null;
                this.cardNumberError = null;
                this.cardCvcError = null;
                this.cardMonthError = null;
                this.cardYearError  = null;
            },
            createToken() {
                this.cardCheckError = false;
                window.Stripe.setPublishableKey(this.stripeKey);
                window.Stripe.createToken(this.card, this.stripeResponseHandler);
                this.cardCheckSending = true;
            },
            stripeResponseHandler(status, response) {
                this.cardCheckSending = false;
                if (response.error) {
                    this.cardCheckErrorMessage = response.error.message;
                    this.cardCheckError = true;
                } else {
                    // token to create a charge on our server
                    var token_from_stripe = response.id;
                    var request = {
                        name: this.name,
                        email: this.email,
                        specialNote: this.specialNote,
                        address: this.address,
                        card: this.card,
                        token_from_stripe: token_from_stripe,
                        amount: 5500
                    };

                    // send to out server
                    axios.post(`${window.endpoint}/charge`, request)
                        .then((res) => {
                            var error = res.data.error;
                            var charge = res.data.charge;
                            console.log(res);
                            if (error) {
                                console.error(error);
                            } else {
                                this.$router.push({ path: `order-complete/${charge.id}` })
                            }
                    });
                }
            }
        }
    }
</script>